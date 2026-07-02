import { PrismaService } from '../shared/prisma.service';
import { Connection } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { ContactsService } from '../crm/contacts.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSearchDto } from 'src/crm/dto/user-search.dto';
export declare class UsersService {
  private readonly contactsService;
  private readonly prisma;
  private readonly repository;
  private readonly emailRepository;
  private readonly rolesRepository;
  private readonly userRolesRepository;
  private readonly personRepository;
  constructor(
    connection: Connection,
    contactsService: ContactsService,
    prisma: PrismaService,
  );
  findAll(req: UserSearchDto): Promise<UserListDto[]>;
  private enrichWithHubAndCourses;
  toListModel(user: User): UserListDto;
  create(data: User): Promise<User>;
  createUser(data: CreateUserDto): Promise<UserListDto>;
  register({ password, email, roles, ...rest }: RegisterUserDto): Promise<User>;
  findOne(id: number): Promise<UserListDto>;
  update(data: UpdateUserDto): Promise<UserListDto>;
  remove(id: number): Promise<void>;
  findByName(username: string): Promise<User | undefined>;
  findById(id: number): Promise<User | undefined>;
  findByRole(roleName: string): Promise<User[] | undefined>;
  exists(username: string): Promise<boolean>;
  saveUserRoles(userid: number, roles: string[]): Promise<void>;
  compareArrays(a: any[], b: any[]): boolean;
}
