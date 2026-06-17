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
exports.HelpController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const help_service_1 = require('./help.service');
const create_help_dto_1 = require('./dto/create-help.dto');
const update_help_dto_1 = require('./dto/update-help.dto');
const swagger_1 = require('@nestjs/swagger');
const jwt_auth_guard_1 = require('../auth/guards/jwt-auth.guard');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const search_dto_1 = require('../shared/dto/search.dto');
let HelpController = class HelpController {
  constructor(helpService) {
    this.helpService = helpService;
  }
  async findAll(req) {
    return await this.helpService.findAll(req);
  }
  create(createHelpDto) {
    return this.helpService.create(createHelpDto);
  }
  async findOne(id) {
    return await this.helpService.findOne(id);
  }
  async update(data) {
    return this.helpService.update(data);
  }
  async remove(id) {
    await this.helpService.remove(id);
  }
};
exports.HelpController = HelpController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('./dto/help.dto').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [search_dto_1.default]),
    __metadata('design:returntype', Promise),
  ],
  HelpController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: require('./dto/help.dto').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [create_help_dto_1.CreateHelpDto]),
    __metadata('design:returntype', Promise),
  ],
  HelpController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/help.dto').default,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  HelpController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('./dto/help.dto').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [update_help_dto_1.UpdateHelpDto]),
    __metadata('design:returntype', Promise),
  ],
  HelpController.prototype,
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
  HelpController.prototype,
  'remove',
  null,
);
exports.HelpController = HelpController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Help'),
    (0, common_1.Controller)('api/help'),
    __metadata('design:paramtypes', [help_service_1.HelpService]),
  ],
  HelpController,
);
//# sourceMappingURL=help.controller.js.map
