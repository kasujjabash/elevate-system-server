import { Connection } from 'typeorm';
import { ContactsService } from 'src/crm/contacts.service';
import { PrismaService } from 'src/shared/prisma.service';
export declare class SeedService {
  private usersService;
  private rolesRepository;
  constructor();
  createAll(
    connection: Connection,
    contactsService: ContactsService,
    prismaService: PrismaService,
  ): Promise<void>;
  createUsers(): Promise<void>;
  createRoles(): Promise<void>;
}
