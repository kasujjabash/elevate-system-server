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
Object.defineProperty(exports, '__esModule', { value: true });
exports.SeedService = void 0;
const common_1 = require('@nestjs/common');
const users_service_1 = require('../users/users.service');
const users_1 = require('./data/users');
const roles_entity_1 = require('../users/entities/roles.entity');
const constants_1 = require('../auth/constants');
let SeedService = class SeedService {
  constructor() {}
  async createAll(connection, contactsService, prismaService) {
    this.rolesRepository = connection.getRepository(roles_entity_1.default);
    this.usersService = new users_service_1.UsersService(
      connection,
      contactsService,
      prismaService,
    );
    await this.createRoles();
    await this.createUsers();
    common_1.Logger.log('🎓 Elevate Academy seed data created successfully');
  }
  async createUsers() {
    try {
      common_1.Logger.log('👥 Creating users...');
      for (const userData of users_1.seedUsers) {
        try {
          await this.usersService.register(userData);
          common_1.Logger.log(`✓ User created: ${userData.email}`);
        } catch (error) {
          if (error.message?.includes('duplicate key value')) {
            common_1.Logger.log(`⚠️ User already exists: ${userData.email}`);
          } else {
            common_1.Logger.error(
              `❌ Failed to create user ${userData.email}:`,
              error.message,
            );
          }
        }
      }
    } catch (error) {
      common_1.Logger.error('❌ Error in createUsers:', error);
    }
  }
  async createRoles() {
    try {
      common_1.Logger.log('🔐 Creating roles...');
      for (const roleDef of [
        constants_1.roleAdmin,
        constants_1.roleTrainer,
        constants_1.roleStudent,
      ]) {
        const existing = await this.rolesRepository.findOne({
          where: { role: roleDef.role },
        });
        if (existing) {
          common_1.Logger.log(`⚠️ Role already exists: ${roleDef.role}`);
        } else {
          await this.rolesRepository.save(roleDef);
          common_1.Logger.log(`✓ Role created: ${roleDef.role}`);
        }
      }
    } catch (error) {
      common_1.Logger.error('❌ Error creating roles:', error);
    }
  }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate(
  [(0, common_1.Injectable)(), __metadata('design:paramtypes', [])],
  SeedService,
);
//# sourceMappingURL=seed.service.js.map
