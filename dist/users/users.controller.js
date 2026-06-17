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
exports.UsersController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const users_service_1 = require('./users.service');
const search_dto_1 = require('../shared/dto/search.dto');
const swagger_1 = require('@nestjs/swagger');
const create_user_dto_1 = require('./dto/create-user.dto');
const update_user_dto_1 = require('./dto/update-user.dto');
const jwt_auth_guard_1 = require('../auth/guards/jwt-auth.guard');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
let UsersController = class UsersController {
  constructor(service) {
    this.service = service;
  }
  async findAll(req) {
    return this.service.findAll(req);
  }
  async create(data) {
    return await this.service.createUser(data);
  }
  async update(data) {
    return await this.service.update(data);
  }
  async updateById(id, data) {
    return await this.service.update({ ...data, id });
  }
  async findOne(id) {
    return await this.service.findOne(id);
  }
  async remove(id) {
    await this.service.remove(id);
  }
};
exports.UsersController = UsersController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('./dto/user.dto').UserListDto],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [search_dto_1.default]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: require('./dto/user.dto').UserListDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [create_user_dto_1.CreateUserDto]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/user.dto').UserListDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [update_user_dto_1.UpdateUserDto]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/user.dto').UserListDto,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, update_user_dto_1.UpdateUserDto]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'updateById',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/user.dto').UserListDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  UsersController.prototype,
  'findOne',
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
  UsersController.prototype,
  'remove',
  null,
);
exports.UsersController = UsersController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('api/users'),
    __metadata('design:paramtypes', [users_service_1.UsersService]),
  ],
  UsersController,
);
//# sourceMappingURL=users.controller.js.map
