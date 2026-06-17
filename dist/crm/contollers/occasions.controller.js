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
exports.OccasionsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const occasion_entity_1 = require('../entities/occasion.entity');
const typeorm_1 = require('typeorm');
const search_dto_1 = require('../../shared/dto/search.dto');
const jwt_auth_guard_1 = require('../../auth/guards/jwt-auth.guard');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
let OccasionsController = class OccasionsController {
  constructor(connection) {
    this.repository = connection.getRepository(occasion_entity_1.default);
  }
  async findAll(req) {
    return await this.repository.find({
      skip: req.skip,
      take: req.limit,
    });
  }
  async create(data) {
    return await this.repository.save(data);
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
exports.OccasionsController = OccasionsController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('../entities/occasion.entity').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [search_dto_1.default]),
    __metadata('design:returntype', Promise),
  ],
  OccasionsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: require('../entities/occasion.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [occasion_entity_1.default]),
    __metadata('design:returntype', Promise),
  ],
  OccasionsController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/occasion.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [occasion_entity_1.default]),
    __metadata('design:returntype', Promise),
  ],
  OccasionsController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/occasion.entity').default,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  OccasionsController.prototype,
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
  OccasionsController.prototype,
  'remove',
  null,
);
exports.OccasionsController = OccasionsController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Crm Occasions'),
    (0, common_1.Controller)('api/crm/occasions'),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  OccasionsController,
);
//# sourceMappingURL=occasions.controller.js.map
