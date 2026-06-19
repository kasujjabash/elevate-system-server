import { HttpException, Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { In, Repository, Connection, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import Email from 'src/crm/entities/email.entity';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import SearchDto from '../shared/dto/search.dto';
import { ContactsService } from '../crm/contacts.service';
import Contact from '../crm/entities/contact.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user.dto';
import { getPersonFullName } from '../crm/crm.helpers';
import * as bcrypt from 'bcrypt';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateUserDto } from './dto/create-user.dto';
import { hasNoValue, hasValue, isArray } from '../utils/validation';
import Roles from './entities/roles.entity';
import UserRoles from './entities/userRoles.entity';
import { differenceBy } from 'lodash';
import { UserSearchDto } from 'src/crm/dto/user-search.dto';
import Person from 'src/crm/entities/person.entity';

@Injectable()
export class UsersService {
  private readonly repository: Repository<User>;
  private readonly emailRepository: Repository<Email>;
  private readonly rolesRepository: Repository<Roles>;
  private readonly userRolesRepository: Repository<UserRoles>;
  private readonly personRepository: Repository<Person>;
  constructor(
    @Inject('CONNECTION') connection: Connection,
    private readonly contactsService: ContactsService,
    private readonly prisma: PrismaService,
  ) {
    this.repository = connection.getRepository(User);
    this.emailRepository = connection.getRepository(Email);
    this.rolesRepository = connection.getRepository(Roles);
    this.userRolesRepository = connection.getRepository(UserRoles);
    this.personRepository = connection.getRepository(Person);
  }

  async findAll(req: UserSearchDto): Promise<UserListDto[]> {
    try {
      let hasFilter = false;
      const idList: number[] = [];

      if (hasValue(req.query)) {
        hasFilter = true;
        const resp = await this.personRepository.find({
          select: ['contactId'],
          where: [
            {
              firstName: ILike(`%${req.query.trim()}%`),
            },
            {
              lastName: ILike(`%${req.query.trim()}%`),
            },
            {
              middleName: ILike(`%${req.query.trim()}%`),
            },
          ],
        });
        idList.push(...resp.map((it) => it.contactId));

        const respEmail = await this.emailRepository.find({
          select: ['contactId'],
          where: { value: ILike(`%${req.query.trim().toLowerCase()}%`) },
        });
        idList.push(...respEmail.map((it) => it.contactId));
      }

      if (hasFilter && hasNoValue(idList)) {
        return [];
      }

      const data = await this.repository.find({
        relations: [
          'contact',
          'contact.person',
          'userRoles',
          'userRoles.roles',
        ],
        skip: req.skip,
        take: req.limit,
        where: hasValue(idList) ? { id: In(idList) } : undefined,
      });

      return data.map((it) => {
        return this.toListModel(it);
      });
    } catch (error: any) {
      Logger.error(error?.message ?? error);
      return [];
    }
  }

  toListModel(user: User): UserListDto {
    if (!user) {
      throw new Error('User is null or undefined');
    }

    const fullName = user.contact?.person
      ? getPersonFullName(user.contact.person)
      : 'Unknown User';
    return {
      avatar: user.contact?.person?.avatar || null,
      contact: {
        id: user.contactId,
        name: fullName,
      },
      id: user.id,
      roles: user.userRoles?.length
        ? user.userRoles.map((ur) => ur.roles?.role).filter(Boolean)
        : user.roles
        ? user.roles
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean)
        : [],
      isActive: user.isActive,
      username: user.username,
      contactId: user.contactId,
      fullName,
    };
  }

  async create(data: User): Promise<User> {
    data.hashPassword();

    return await this.repository.save(data);
  }

  async createUser(data: CreateUserDto): Promise<UserListDto> {
    const username = data.username;
    if (!username) throw new HttpException('Email/username is required', 400);

    let contactId = data.contactId;

    if (!contactId) {
      // Auto-create contact + person + email from the provided name/email
      // Use case-insensitive check so Jackie@… and jackie@… are treated as the same account.
      const existingUser = await this.prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
      });
      if (existingUser)
        throw new HttpException(
          'This email address is already registered. Please use a different email.',
          400,
        );

      const contact = await this.prisma.contact.create({
        data: { category: 'Person' },
      });
      await this.prisma.person.create({
        data: {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gender: 'Male',
          contactId: contact.id,
          ...(data.dateOfBirth
            ? { dateOfBirth: new Date(data.dateOfBirth) }
            : {}),
        },
      });
      await this.prisma.email.create({
        data: {
          value: username,
          category: 'Work',
          isPrimary: true,
          contactId: contact.id,
        },
      });
      if (data.phone) {
        await this.prisma.phone.create({
          data: {
            value: data.phone,
            category: 'Mobile',
            isPrimary: true,
            contactId: contact.id,
          },
        });
      }
      contactId = contact.id;
    } else {
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
        include: { person: true, email: true },
      });
      if (!contact) throw new HttpException('Contact Not Found', 404);

      const existing = await this.prisma.user.findUnique({
        where: { contactId },
      });
      if (existing)
        throw new HttpException(
          'A user account already exists for this contact',
          400,
        );

      const duplicateUsername = await this.prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
      });
      if (duplicateUsername)
        throw new HttpException(
          'This email address is already registered. Please use a different email.',
          400,
        );
    }

    const rolesStr = Array.isArray(data.roles)
      ? data.roles.join(',')
      : data.roles || '';

    const rolesArr = rolesStr ? rolesStr.split(',').map((r) => r.trim()) : [];
    const isHubManager = rolesArr.includes('HUB_MANAGER');
    const isTrainer =
      rolesArr.includes('TRAINER') || rolesArr.includes('INSTRUCTOR');
    const isStudent = rolesArr.includes('STUDENT');

    if (isStudent && !data.hubId) {
      throw new HttpException(
        'A hub must be selected for student accounts',
        400,
      );
    }

    if (isHubManager && !data.hubId) {
      throw new HttpException(
        'A hub must be selected for hub manager accounts',
        400,
      );
    }

    const created = await this.prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(data.password, 10),
        contactId,
        isActive: data.isActive ?? true,
        roles: rolesStr,
        ...(isHubManager && data.hubId ? { hubId: data.hubId } : {}),
      },
      include: { contact: { include: { person: true } } },
    });

    // Auto-create instructor record for trainers (no hub required — fall back to first available hub)
    if (isTrainer) {
      const existingInstructor = await this.prisma.instructor.findUnique({
        where: { contactId: contactId },
      });
      if (!existingInstructor) {
        const count = await this.prisma.instructor.count();
        let instructorHubId: number = data.hubId;
        if (!instructorHubId) {
          const firstHub = await this.prisma.hub.findFirst({
            orderBy: { id: 'asc' },
          });
          instructorHubId = firstHub?.id ?? 1;
        }
        await this.prisma.instructor.create({
          data: {
            contactId: contactId,
            hubId: instructorHubId,
            employeeId: `TR${String(count + 1).padStart(4, '0')}`,
            isActive: true,
          },
        });
      }
    }

    // Auto-create student record linked to their hub
    let studentDbId: number | null = null;
    if (isStudent) {
      let studentRecord = await this.prisma.student.findUnique({
        where: { contactId },
      });
      if (!studentRecord) {
        const lastStudent = await this.prisma.student.findFirst({
          orderBy: { studentId: 'desc' },
          select: { studentId: true },
        });
        const lastNum = lastStudent
          ? parseInt(lastStudent.studentId.replace('EA', ''), 10)
          : 0;
        const studentId = `EA${String(lastNum + 1).padStart(6, '0')}`;
        studentRecord = await this.prisma.student.create({
          data: {
            contactId,
            hubId: data.hubId,
            studentId,
            status: 'Active',
          },
        });
      }
      studentDbId = studentRecord.id;
    }

    // Assign courses
    if (data.courseIds?.length) {
      if (isStudent && studentDbId) {
        // Enroll student in each course
        for (const courseId of data.courseIds) {
          await this.prisma.enrollment
            .create({
              data: { studentId: studentDbId, courseId, status: 'Enrolled' },
            })
            .catch((err) => {
              Logger.warn(
                `Enrollment skipped for student ${studentDbId} course ${courseId}: ${err?.message}`,
              );
            });
        }
      } else if (isTrainer) {
        // Find the instructor record for this trainer
        const instructor = await this.prisma.instructor.findUnique({
          where: { contactId },
        });
        if (instructor) {
          for (const courseId of data.courseIds) {
            await this.prisma.course
              .update({
                where: { id: courseId },
                data: { instructorId: instructor.id },
              })
              .catch(() => {
                /* skip missing course */
              });
          }
        }
      }
    }

    const fullName = created.contact?.person
      ? `${created.contact.person.firstName} ${created.contact.person.lastName}`.trim()
      : username;

    return {
      id: created.id,
      username: created.username,
      contactId: created.contactId,
      isActive: created.isActive,
      roles: rolesArr,
      fullName,
      email: created.username,
      permissions: [],
    } as any;
  }

  async register({
    password,
    email,
    roles,
    ...rest
  }: RegisterUserDto): Promise<User> {
    const duplicateUsername = await this.prisma.user.findFirst({
      where: { username: { equals: email, mode: 'insensitive' } },
    });
    if (duplicateUsername)
      throw new HttpException(
        'This email address is already registered. Please use a different email.',
        400,
      );

    const contact = await this.contactsService.createPerson({ ...rest, email });
    const user = new User();
    user.username = email;
    user.password = password;
    user.contact = Contact.ref(contact.id);
    user.isActive = true;
    user.hashPassword();
    const saveUser = await this.repository.save(user);
    if (saveUser) {
      await this.saveUserRoles(saveUser.id, roles);
    }

    return saveUser;
  }

  async findOne(id: number): Promise<UserListDto> {
    const data = await this.repository.findOne({
      relations: ['contact', 'contact.person', 'userRoles', 'userRoles.roles'],
      where: { id: id },
    });

    if (!data) {
      throw new Error(`User with ID ${id} not found`);
    }

    return this.toListModel(data);
  }

  async update(data: UpdateUserDto): Promise<UserListDto> {
    if (!data.id) {
      throw new HttpException('User ID is required', 400);
    }
    const _user = await this.findOne(data.id);

    if (data.oldPassword) {
      const oldPassword = (await this.findByName(_user.username)).password;
      const isSame = bcrypt.compareSync(data.oldPassword, oldPassword);
      if (!isSame) {
        throw new HttpException('Old Password Is Incorrect', 406);
      }
    }

    const update: QueryDeepPartialEntity<User> = {
      isActive: data.isActive,
    };

    const shouldInvalidateTokens =
      hasValue(data.password) || data.isActive === false;

    if (hasValue(data.password)) {
      const user = new User();
      user.password = data.password;
      user.hashPassword();
      update.password = user.password;
    }

    if (data.roles?.length > 0 && data.roles.some((r) => r.trim() !== '')) {
      const dbUserRolesStrArr: string[] = [];
      const sentRolesStrArr: string[] = [];
      const getdbUserRoles = await this.userRolesRepository.find({
        relations: ['roles'],
        where: { userId: data.id },
      });
      getdbUserRoles.map((it: UserRoles) =>
        dbUserRolesStrArr.push(it.roles.role),
      );

      const getRoles = await this.rolesRepository.find({
        where: { role: In(data.roles) },
      });
      getRoles.map((it: Roles) => sentRolesStrArr.push(it.role));
      const currentDbRoles = getdbUserRoles.map((it: UserRoles) => ({
        id: it.id,
        rolesId: it.rolesId,
        role: it.roles.role,
      }));
      const getRolesIds = getRoles.map((it: Roles) => ({
        id: it.id,
        role: it.role,
      }));

      if (!this.compareArrays(dbUserRolesStrArr, sentRolesStrArr)) {
        const toDelete = differenceBy(currentDbRoles, getRolesIds, 'role');
        toDelete.map(
          async (it) => await this.userRolesRepository.delete(it.id),
        );

        const toAdd = differenceBy(getRolesIds, currentDbRoles, 'role');
        toAdd.map((it) => this.saveUserRoles(data.id, [it.role]));
      }

      // Keep the roles string column in sync so JWT auth reads correct roles
      if (sentRolesStrArr.length > 0) {
        update.roles = sentRolesStrArr.join(',');
      }
    }

    await this.repository
      .createQueryBuilder()
      .update()
      .set(update)
      .where('id = :id', { id: data.id })
      .execute();

    // Safety net: if roles were accidentally cleared, restore from userRoles join table
    const currentUser = await this.prisma.user.findUnique({
      where: { id: data.id },
      select: { roles: true },
    });
    if (!currentUser?.roles) {
      const userRoles = await this.userRolesRepository.find({
        relations: ['roles'],
        where: { userId: data.id },
      });
      const roleStr = userRoles
        .map((ur) => ur.roles?.role)
        .filter(Boolean)
        .join(',');
      if (roleStr) {
        await this.prisma.user.update({
          where: { id: data.id },
          data: { roles: roleStr },
        });
      }
    }

    // Invalidate all existing tokens when password changes or user is deactivated
    if (shouldInvalidateTokens) {
      await this.prisma.user.update({
        where: { id: data.id },
        data: { tokenVersion: { increment: 1 } },
      });
    }

    // Persist hubId via Prisma (TypeORM entity doesn't know about this column)
    if (data.hubId !== undefined) {
      await this.prisma.user.update({
        where: { id: data.id },
        data: { hubId: data.hubId },
      });
    }

    // Persist phone, dateOfBirth, firstName, lastName via Prisma (contact → person / phone tables)
    if (
      data.contactId &&
      (data.phone !== undefined ||
        data.dateOfBirth !== undefined ||
        data.firstName !== undefined ||
        data.lastName !== undefined)
    ) {
      const personData: any = {};
      if (data.dateOfBirth !== undefined) {
        personData.dateOfBirth = data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : null;
      }
      if (data.firstName !== undefined) personData.firstName = data.firstName;
      if (data.lastName !== undefined) personData.lastName = data.lastName;
      if (Object.keys(personData).length > 0) {
        await this.prisma.person.updateMany({
          where: { contactId: data.contactId },
          data: personData,
        });
      }
      if (data.phone !== undefined) {
        const existing = await this.prisma.phone.findFirst({
          where: { contactId: data.contactId },
        });
        if (existing) {
          await this.prisma.phone.update({
            where: { id: existing.id },
            data: { value: data.phone },
          });
        } else if (data.phone) {
          await this.prisma.phone.create({
            data: {
              value: data.phone,
              category: 'Mobile',
              isPrimary: true,
              contactId: data.contactId,
            },
          });
        }
      }
    }

    // Assign courses to trainer: update course.instructorId for each courseId
    if (data.courseIds?.length && data.contactId) {
      const instructor = await this.prisma.instructor.findUnique({
        where: { contactId: data.contactId },
      });
      if (instructor) {
        for (const courseId of data.courseIds) {
          await this.prisma.course
            .update({
              where: { id: courseId },
              data: { instructorId: instructor.id },
            })
            .catch(() => {
              /* skip missing course */
            });
        }
      }
    }

    return await this.findOne(data.id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(username: string): Promise<User | undefined> {
    const relations = [
      'contact',
      'contact.person',
      'userRoles',
      'userRoles.roles',
    ];
    // Prefer exact-case match so two accounts that differ only in casing
    // (e.g. jackie@… vs Jackie@…) always resolve to the intended one.
    const exact = await this.repository.findOne({
      where: { username },
      relations,
    });
    if (exact) return exact;
    return this.repository.findOne({
      where: { username: ILike(username) },
      relations,
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.repository.findOne({
      where: { id: id },
      relations: ['contact', 'contact.person'],
    });
  }

  async findByRole(roleName: string): Promise<User[] | undefined> {
    try {
      // Find the role by its name
      const role = await this.rolesRepository.findOne({
        where: { role: roleName },
      });

      if (!role) {
        throw new Error(`Role with name ${roleName} not found`);
      }

      // Find users with the specified role
      return await this.repository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.userRoles', 'userRoles')
        .innerJoinAndSelect('userRoles.roles', 'roles')
        .leftJoinAndSelect('user.contact', 'contact')
        .where('roles.id = :roleId', { roleId: role.id })
        .getMany();
    } catch (error) {
      throw error;
    }
  }

  async exists(username: string): Promise<boolean> {
    const count = await this.repository.count({ where: { username } });
    return count > 0;
  }

  async saveUserRoles(userid: number, roles: string[]) {
    const rolesToRegister = await this.rolesRepository.find({
      where: { role: In(roles) },
    });
    const roleIds = rolesToRegister.map((it: Roles) => it.id);

    roleIds.map(async (it) => {
      const toSave = new UserRoles();
      toSave.userId = userid;
      toSave.rolesId = it;
      const saveRoles = await this.userRolesRepository.save(toSave);

      if (!saveRoles) {
        throw new HttpException('Failed To Create User Roles', 400);
      }
    });
  }

  compareArrays(a: any[], b: any[]) {
    return (
      isArray(a) &&
      isArray(b) &&
      a.length === b.length &&
      a.every((ele) => b.includes(ele))
    );
  }
}
