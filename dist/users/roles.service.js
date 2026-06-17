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
exports.RolesService = void 0;
const common_1 = require('@nestjs/common');
const constants_1 = require('../auth/constants');
const validation_1 = require('../utils/validation');
const typeorm_1 = require('typeorm');
const roles_entity_1 = require('./entities/roles.entity');
let RolesService = class RolesService {
  constructor(connection) {
    this.repository = connection.getRepository(roles_entity_1.default);
  }
  async create(userRole) {
    const checkRole = await this.repository.findOne({
      where: [{ role: userRole.role }],
    });
    if (checkRole) {
      throw new common_1.BadRequestException({
        message:
          'Duplicate role or permission entry detected. Contact your administrator',
      });
    }
    return await this.repository.save(userRole);
  }
  async findAll(req) {
    const filter = {};
    if ((0, validation_1.hasValue)(req.query)) {
      filter.role = (0, typeorm_1.ILike)(`%${req.query.trim().toLowerCase()}%`);
    }
    return await this.repository.find({
      where: filter,
    });
  }
  async findOne(id) {
    return await this.repository.findOne({ where: { id } });
  }
  async update(userRole) {
    const checkRole = await this.repository.findOne({
      where: { id: userRole.id },
    });
    if (checkRole.role === constants_1.roleAdmin.role) {
      throw new common_1.BadRequestException({
        message: 'Unable to edit an Admin role. Contact your administrator',
      });
    }
    return await this.repository.save(userRole);
  }
  async remove(roleId) {
    const checkRole = await this.repository.findOne({
      where: { id: roleId },
    });
    if (checkRole.role === constants_1.roleAdmin.role) {
      throw new common_1.BadRequestException({
        message: 'Unable to delete an Admin role. Contact your administrator',
      });
    }
    if (checkRole.isActive) {
      throw new common_1.BadRequestException({
        message:
          'Unable to delete an active role. Make sure no users have been assigned this role',
      });
    }
    await this.repository.delete(roleId);
  }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  RolesService,
);
//# sourceMappingURL=roles.service.js.map
