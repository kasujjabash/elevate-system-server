import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { seedUsers } from './data/users';
import { Repository, Connection } from 'typeorm';
import Roles from 'src/users/entities/roles.entity';
import { roleAdmin, roleStudent } from 'src/auth/constants';
import { ContactsService } from 'src/crm/contacts.service';
import { JwtHelperService } from 'src/auth/jwt-helpers.service';

@Injectable()
export class SeedService {
  private usersService: UsersService;
  private rolesRepository: Repository<Roles>;

  constructor() {}

  // Simplified seed service for school system
  async createAll(
    connection: Connection,
    contactsService: ContactsService,
    jwtHelperservice: JwtHelperService,
  ) {
    this.rolesRepository = connection.getRepository(Roles);

    this.usersService = new UsersService(
      connection,
      contactsService,
      jwtHelperservice,
    );

    await this.createRoles();
    await this.createUsers();

    Logger.log('🎓 Elevate Academy seed data created successfully');
  }

  async createUsers() {
    try {
      Logger.log('👥 Creating users...');
      for (const userData of seedUsers) {
        try {
          await this.usersService.register(userData);
          Logger.log(`✓ User created: ${userData.email}`);
        } catch (error) {
          if (error.message?.includes('duplicate key value')) {
            Logger.log(`⚠️ User already exists: ${userData.email}`);
          } else {
            Logger.error(
              `❌ Failed to create user ${userData.email}:`,
              error.message,
            );
          }
        }
      }
    } catch (error) {
      Logger.error('❌ Error in createUsers:', error);
    }
  }

  async createRoles() {
    try {
      Logger.log('🔐 Creating roles...');
      for (const roleDef of [roleAdmin, roleStudent]) {
        const existing = await this.rolesRepository.findOne({
          where: { role: roleDef.role },
        });
        if (existing) {
          Logger.log(`⚠️ Role already exists: ${roleDef.role}`);
        } else {
          await this.rolesRepository.save(roleDef);
          Logger.log(`✓ Role created: ${roleDef.role}`);
        }
      }
    } catch (error) {
      Logger.error('❌ Error creating roles:', error);
    }
  }
}
