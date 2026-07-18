'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UsersService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
const typeorm_1 = require('typeorm');
const user_entity_1 = require('./entities/user.entity');
const email_entity_1 = require('../crm/entities/email.entity');
const contacts_service_1 = require('../crm/contacts.service');
const contact_entity_1 = require('../crm/entities/contact.entity');
const crm_helpers_1 = require('../crm/crm.helpers');
const bcrypt = require('bcrypt');
const validation_1 = require('../utils/validation');
const roles_entity_1 = require('./entities/roles.entity');
const userRoles_entity_1 = require('./entities/userRoles.entity');
const lodash_1 = require('lodash');
const person_entity_1 = require('../crm/entities/person.entity');
let UsersService = class UsersService {
  constructor(connection, contactsService, prisma) {
    this.contactsService = contactsService;
    this.prisma = prisma;
    this.repository = connection.getRepository(user_entity_1.User);
    this.emailRepository = connection.getRepository(email_entity_1.default);
    this.rolesRepository = connection.getRepository(roles_entity_1.default);
    this.userRolesRepository = connection.getRepository(
      userRoles_entity_1.default,
    );
    this.personRepository = connection.getRepository(person_entity_1.default);
  }
  async findAll(req) {
    try {
      let hasFilter = false;
      const idList = [];
      if ((0, validation_1.hasValue)(req.query)) {
        hasFilter = true;
        const resp = await this.personRepository.find({
          select: ['contactId'],
          where: [
            {
              firstName: (0, typeorm_1.ILike)(`%${req.query.trim()}%`),
            },
            {
              lastName: (0, typeorm_1.ILike)(`%${req.query.trim()}%`),
            },
            {
              middleName: (0, typeorm_1.ILike)(`%${req.query.trim()}%`),
            },
          ],
        });
        idList.push(...resp.map((it) => it.contactId));
        const respEmail = await this.emailRepository.find({
          select: ['contactId'],
          where: {
            value: (0, typeorm_1.ILike)(`%${req.query.trim().toLowerCase()}%`),
          },
        });
        idList.push(...respEmail.map((it) => it.contactId));
      }
      if (hasFilter && (0, validation_1.hasNoValue)(idList)) {
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
        where: (0, validation_1.hasValue)(idList)
          ? { id: (0, typeorm_1.In)(idList) }
          : undefined,
      });
      return await this.enrichWithHubAndCourses(
        data.map((it) => this.toListModel(it)),
      );
    } catch (error) {
      common_1.Logger.error(error?.message ?? error);
      return [];
    }
  }
  async enrichWithHubAndCourses(models) {
    if (!models.length) return models;
    const userIds = models.map((m) => m.id);
    const contactIds = models.map((m) => m.contactId).filter(Boolean);
    const [hubUsers, students, instructors, phones] = await Promise.all([
      this.prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, hubId: true, hub: { select: { name: true } } },
      }),
      this.prisma.student.findMany({
        where: { contactId: { in: contactIds } },
        select: {
          contactId: true,
          enrollments: {
            where: { status: { not: 'Dropped' } },
            select: { course: { select: { id: true, title: true } } },
          },
        },
      }),
      this.prisma.instructor.findMany({
        where: { contactId: { in: contactIds } },
        select: {
          contactId: true,
          courses: { select: { id: true, title: true } },
        },
      }),
      this.prisma.phone.findMany({
        where: { contactId: { in: contactIds } },
        select: { contactId: true, value: true, isPrimary: true },
      }),
    ]);
    const hubByUserId = new Map(hubUsers.map((u) => [u.id, u]));
    const studentByContactId = new Map(students.map((s) => [s.contactId, s]));
    const instructorByContactId = new Map(
      instructors.map((i) => [i.contactId, i]),
    );
    const phoneByContactId = new Map();
    phones.forEach((p) => {
      if (!phoneByContactId.has(p.contactId) || p.isPrimary) {
        phoneByContactId.set(p.contactId, p.value);
      }
    });
    return models.map((m) => {
      const hubInfo = hubByUserId.get(m.id);
      const courseList =
        studentByContactId.get(m.contactId)?.enrollments.map((e) => e.course) ??
        instructorByContactId.get(m.contactId)?.courses ??
        [];
      return {
        ...m,
        hubId: hubInfo?.hubId ?? null,
        hubName: hubInfo?.hub?.name ?? null,
        courseIds: courseList.map((c) => c.id),
        courses: courseList.map((c) => ({ id: c.id, name: c.title })),
        phone: phoneByContactId.get(m.contactId) || '',
      };
    });
  }
  toListModel(user) {
    if (!user) {
      throw new Error('User is null or undefined');
    }
    const fullName = user.contact?.person
      ? (0, crm_helpers_1.getPersonFullName)(user.contact.person)
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
      firstName: user.contact?.person?.firstName || '',
      lastName: user.contact?.person?.lastName || '',
      dateOfBirth: user.contact?.person?.dateOfBirth || null,
      gender: user.contact?.person?.gender || '',
    };
  }
  async create(data) {
    data.hashPassword();
    return await this.repository.save(data);
  }
  async createUser(data) {
    const username = data.username;
    if (!username)
      throw new common_1.HttpException('Email/username is required', 400);
    let contactId = data.contactId;
    if (!contactId) {
      const existingUser = await this.prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
      });
      if (existingUser)
        throw new common_1.HttpException(
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
          gender: data.gender || 'Male',
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
      if (!contact) throw new common_1.HttpException('Contact Not Found', 404);
      const existing = await this.prisma.user.findUnique({
        where: { contactId },
      });
      if (existing)
        throw new common_1.HttpException(
          'A user account already exists for this contact',
          400,
        );
      const duplicateUsername = await this.prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
      });
      if (duplicateUsername)
        throw new common_1.HttpException(
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
      throw new common_1.HttpException(
        'A hub must be selected for student accounts',
        400,
      );
    }
    if (isHubManager && !data.hubId) {
      throw new common_1.HttpException(
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
    if (isTrainer) {
      const existingInstructor = await this.prisma.instructor.findUnique({
        where: { contactId: contactId },
      });
      if (!existingInstructor) {
        const count = await this.prisma.instructor.count();
        let instructorHubId = data.hubId;
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
    let studentDbId = null;
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
    if (data.courseIds?.length) {
      if (isStudent && studentDbId) {
        for (const courseId of data.courseIds) {
          await this.prisma.enrollment
            .create({
              data: { studentId: studentDbId, courseId, status: 'Enrolled' },
            })
            .catch((err) => {
              common_1.Logger.warn(
                `Enrollment skipped for student ${studentDbId} course ${courseId}: ${err?.message}`,
              );
            });
        }
      } else if (isTrainer) {
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
              .catch(() => {});
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
    };
  }
  async register({ password, email, roles, ...rest }) {
    const duplicateUsername = await this.prisma.user.findFirst({
      where: { username: { equals: email, mode: 'insensitive' } },
    });
    if (duplicateUsername)
      throw new common_1.HttpException(
        'This email address is already registered. Please use a different email.',
        400,
      );
    const contact = await this.contactsService.createPerson({ ...rest, email });
    const user = new user_entity_1.User();
    user.username = email;
    user.password = password;
    user.contact = contact_entity_1.default.ref(contact.id);
    user.isActive = true;
    user.hashPassword();
    const saveUser = await this.repository.save(user);
    if (saveUser) {
      await this.saveUserRoles(saveUser.id, roles);
    }
    return saveUser;
  }
  async findOne(id) {
    const data = await this.repository.findOne({
      relations: ['contact', 'contact.person', 'userRoles', 'userRoles.roles'],
      where: { id: id },
    });
    if (!data) {
      throw new Error(`User with ID ${id} not found`);
    }
    const [enriched] = await this.enrichWithHubAndCourses([
      this.toListModel(data),
    ]);
    return enriched;
  }
  async update(data) {
    if (!data.id) {
      throw new common_1.HttpException('User ID is required', 400);
    }
    const _user = await this.findOne(data.id);
    if (data.oldPassword) {
      const oldPassword = (await this.findByName(_user.username)).password;
      const isSame = bcrypt.compareSync(data.oldPassword, oldPassword);
      if (!isSame) {
        throw new common_1.HttpException('Old Password Is Incorrect', 406);
      }
    }
    const update = {
      isActive: data.isActive,
    };
    const shouldInvalidateTokens =
      (data.password && data.password.trim().length > 0) ||
      data.isActive === false;
    if (data.password && data.password.trim().length > 0) {
      const user = new user_entity_1.User();
      user.password = data.password;
      user.hashPassword();
      update.password = user.password;
    }
    if (data.roles?.length > 0 && data.roles.some((r) => r.trim() !== '')) {
      const dbUserRolesStrArr = [];
      const sentRolesStrArr = [];
      const getdbUserRoles = await this.userRolesRepository.find({
        relations: ['roles'],
        where: { userId: data.id },
      });
      getdbUserRoles.map((it) => dbUserRolesStrArr.push(it.roles.role));
      const getRoles = await this.rolesRepository.find({
        where: { role: (0, typeorm_1.In)(data.roles) },
      });
      getRoles.map((it) => sentRolesStrArr.push(it.role));
      const currentDbRoles = getdbUserRoles.map((it) => ({
        id: it.id,
        rolesId: it.rolesId,
        role: it.roles.role,
      }));
      const getRolesIds = getRoles.map((it) => ({
        id: it.id,
        role: it.role,
      }));
      if (!this.compareArrays(dbUserRolesStrArr, sentRolesStrArr)) {
        const toDelete = (0, lodash_1.differenceBy)(
          currentDbRoles,
          getRolesIds,
          'role',
        );
        toDelete.map(
          async (it) => await this.userRolesRepository.delete(it.id),
        );
        const toAdd = (0, lodash_1.differenceBy)(
          getRolesIds,
          currentDbRoles,
          'role',
        );
        toAdd.map((it) => this.saveUserRoles(data.id, [it.role]));
      }
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
    if (shouldInvalidateTokens) {
      await this.prisma.user.update({
        where: { id: data.id },
        data: { tokenVersion: { increment: 1 } },
      });
    }
    if (data.hubId !== undefined) {
      await this.prisma.user.update({
        where: { id: data.id },
        data: { hubId: data.hubId },
      });
    }
    if (
      data.contactId &&
      (data.phone !== undefined ||
        data.dateOfBirth !== undefined ||
        data.firstName !== undefined ||
        data.lastName !== undefined ||
        data.gender !== undefined)
    ) {
      const personData = {};
      if (data.dateOfBirth !== undefined) {
        personData.dateOfBirth = data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : null;
      }
      if (data.firstName !== undefined) personData.firstName = data.firstName;
      if (data.lastName !== undefined) personData.lastName = data.lastName;
      if (data.gender !== undefined) personData.gender = data.gender;
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
    if (data.courseIds !== undefined && data.contactId) {
      const isStudentEdit = _user.roles?.includes('STUDENT');
      if (isStudentEdit) {
        const student = await this.prisma.student.findUnique({
          where: { contactId: data.contactId },
        });
        if (student) {
          const current = await this.prisma.enrollment.findMany({
            where: { studentId: student.id },
          });
          const desired = new Set(data.courseIds);
          const existingCourseIds = new Set(current.map((e) => e.courseId));
          const toRemove = current.filter(
            (e) => !desired.has(e.courseId) && e.status !== 'Completed',
          );
          const toAdd = data.courseIds.filter(
            (courseId) => !existingCourseIds.has(courseId),
          );
          await Promise.all([
            ...toRemove.map((e) =>
              this.prisma.enrollment.delete({ where: { id: e.id } }),
            ),
            ...toAdd.map((courseId) =>
              this.prisma.enrollment
                .create({
                  data: { studentId: student.id, courseId, status: 'Enrolled' },
                })
                .catch(() => {}),
            ),
          ]);
        }
      } else if (data.courseIds.length) {
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
              .catch(() => {});
          }
        }
      }
    }
    return await this.findOne(data.id);
  }
  async remove(id) {
    await this.repository.delete(id);
  }
  async findByName(username) {
    const relations = [
      'contact',
      'contact.person',
      'userRoles',
      'userRoles.roles',
    ];
    const exact = await this.repository.findOne({
      where: { username },
      relations,
    });
    if (exact) return exact;
    return this.repository.findOne({
      where: { username: (0, typeorm_1.ILike)(username) },
      relations,
    });
  }
  async findById(id) {
    return this.repository.findOne({
      where: { id: id },
      relations: ['contact', 'contact.person'],
    });
  }
  async findByRole(roleName) {
    try {
      const role = await this.rolesRepository.findOne({
        where: { role: roleName },
      });
      if (!role) {
        throw new Error(`Role with name ${roleName} not found`);
      }
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
  async exists(username) {
    const count = await this.repository.count({ where: { username } });
    return count > 0;
  }
  async saveUserRoles(userid, roles) {
    const rolesToRegister = await this.rolesRepository.find({
      where: { role: (0, typeorm_1.In)(roles) },
    });
    const roleIds = rolesToRegister.map((it) => it.id);
    roleIds.map(async (it) => {
      const toSave = new userRoles_entity_1.default();
      toSave.userId = userid;
      toSave.rolesId = it;
      const saveRoles = await this.userRolesRepository.save(toSave);
      if (!saveRoles) {
        throw new common_1.HttpException('Failed To Create User Roles', 400);
      }
    });
  }
  compareArrays(a, b) {
    return (
      (0, validation_1.isArray)(a) &&
      (0, validation_1.isArray)(b) &&
      a.length === b.length &&
      a.every((ele) => b.includes(ele))
    );
  }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      contacts_service_1.ContactsService,
      prisma_service_1.PrismaService,
    ]),
  ],
  UsersService,
);
//# sourceMappingURL=users.service.js.map
