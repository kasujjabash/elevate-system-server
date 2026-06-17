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
exports.PhonesController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const phone_entity_1 = require('../entities/phone.entity');
const typeorm_1 = require('typeorm');
const search_dto_1 = require('../../shared/dto/search.dto');
const jwt_auth_guard_1 = require('../../auth/guards/jwt-auth.guard');
const phone_dto_1 = require('../dto/phone.dto');
const phones_service_1 = require('../phones.service');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
let PhonesController = class PhonesController {
  constructor(connection, service) {
    this.service = service;
    this.repository = connection.getRepository(phone_entity_1.default);
  }
  async findAll(req) {
    return await this.repository.find({
      skip: req.skip,
      take: req.limit,
    });
  }
  async create(data) {
    return this.service.create(data);
  }
  async update(data) {
    return await this.repository.save(data);
  }
  async findOne(id) {
    return await this.repository.findOne({ where: { id } });
  }
  async remove(id) {
    await this.repository.delete(id);
  }
};
exports.PhonesController = PhonesController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('../entities/phone.entity').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [search_dto_1.default]),
    __metadata('design:returntype', Promise),
  ],
  PhonesController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: [require('../entities/phone.entity').default],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [phone_dto_1.PhoneDto]),
    __metadata('design:returntype', Promise),
  ],
  PhonesController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/phone.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [phone_dto_1.PhoneDto]),
    __metadata('design:returntype', Promise),
  ],
  PhonesController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/phone.entity').default,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  PhonesController.prototype,
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
  PhonesController.prototype,
  'remove',
  null,
);
exports.PhonesController = PhonesController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Crm Phones'),
    (0, common_1.Controller)('api/crm/phones'),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      phones_service_1.PhonesService,
    ]),
  ],
  PhonesController,
);
//# sourceMappingURL=phones.controller.js.map
