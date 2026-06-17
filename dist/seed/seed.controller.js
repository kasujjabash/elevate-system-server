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
exports.SeedController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const public_decorator_1 = require('../auth/decorators/public.decorator');
const child_process_1 = require('child_process');
let SeedController = class SeedController {
  constructor() {}
  async getDatabaseStatus() {
    try {
      return {
        success: true,
        message:
          'Seed controller is working. Use POST /api/seed/users to trigger seeding.',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Seed controller error',
      };
    }
  }
  async debugUser(username) {
    try {
      const userQuery = `SELECT u.id, u.username, u.roles as legacy_roles FROM "user" u WHERE u.username ILIKE '%${username}%'`;
      const rolesQuery = `SELECT ur.id, ur."userId", ur."rolesId", r.role FROM "user_roles" ur JOIN roles r ON ur."rolesId" = r.id WHERE ur."userId" IN (SELECT id FROM "user" WHERE username ILIKE '%${username}%')`;
      return {
        success: true,
        username: username,
        userQuery: userQuery,
        rolesQuery: rolesQuery,
        message: 'Check these queries in your database to debug role loading',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Debug failed',
      };
    }
  }
  async seedUsers() {
    try {
      const result = (0, child_process_1.execSync)('npm run seed:admin', {
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          DB_HOST: process.env.DB_HOST || undefined,
          DB_PORT: process.env.DB_PORT || undefined,
          DB_USERNAME: process.env.DB_USERNAME || undefined,
          DB_PASSWORD: process.env.DB_PASSWORD || undefined,
          DB_DATABASE: process.env.DB_DATABASE || undefined,
          DATABASE_URL: process.env.DATABASE_URL || undefined,
        },
      });
      return {
        success: true,
        message: 'Admin users seeded successfully',
        output: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Admin seeding failed',
        output: error.stdout || '',
      };
    }
  }
};
exports.SeedController = SeedController;
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('status'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  SeedController.prototype,
  'getDatabaseStatus',
  null,
);
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('debug-user/:username'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('username')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise),
  ],
  SeedController.prototype,
  'debugUser',
  null,
);
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('users'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  SeedController.prototype,
  'seedUsers',
  null,
);
exports.SeedController = SeedController = __decorate(
  [(0, common_1.Controller)('api/seed'), __metadata('design:paramtypes', [])],
  SeedController,
);
//# sourceMappingURL=seed.controller.js.map
