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
exports.RolesController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const roles_service_1 = require('./roles.service');
const roles_dto_1 = require('./dto/roles.dto');
const swagger_1 = require('@nestjs/swagger');
const jwt_auth_guard_1 = require('../auth/guards/jwt-auth.guard');
const search_dto_1 = require('../shared/dto/search.dto');
let RolesController = class RolesController {
  constructor(rolesService) {
    this.rolesService = rolesService;
  }
  create(userRole) {
    return this.rolesService.create(userRole);
  }
  findAll(data) {
    return this.rolesService.findAll(data);
  }
  findOne(id) {
    return this.rolesService.findOne(id);
  }
  update(userRole) {
    return this.rolesService.update(userRole);
  }
  remove(id) {
    return this.rolesService.remove(id);
  }
};
exports.RolesController = RolesController;
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: require('./dto/roles.dto').RolesDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [roles_dto_1.RolesDto]),
    __metadata('design:returntype', Promise),
  ],
  RolesController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('./dto/roles.dto').RolesDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [search_dto_1.default]),
    __metadata('design:returntype', Promise),
  ],
  RolesController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/roles.dto').RolesDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  RolesController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/roles.dto').RolesDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [roles_dto_1.RolesDto]),
    __metadata('design:returntype', Promise),
  ],
  RolesController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  RolesController.prototype,
  'remove',
  null,
);
exports.RolesController = RolesController = __decorate(
  [
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('User Roles'),
    (0, common_1.Controller)('api/user-roles'),
    __metadata('design:paramtypes', [roles_service_1.RolesService]),
  ],
  RolesController,
);
//# sourceMappingURL=roles.controller.js.map
