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
exports.HubsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const hubs_service_1 = require('./hubs.service');
const create_hub_dto_1 = require('./dto/create-hub.dto');
const update_hub_dto_1 = require('./dto/update-hub.dto');
const swagger_1 = require('@nestjs/swagger');
let HubsController = class HubsController {
  constructor(hubsService) {
    this.hubsService = hubsService;
  }
  create(createHubDto) {
    return this.hubsService.create(createHubDto);
  }
  findAll() {
    return this.hubsService.findAll();
  }
  findOne(id) {
    return this.hubsService.findOne(id);
  }
  findByCode(code) {
    return this.hubsService.findByCode(code);
  }
  getStatistics(id) {
    return this.hubsService.getHubStatistics(id);
  }
  update(id, updateHubDto) {
    return this.hubsService.update(id, updateHubDto);
  }
  remove(id) {
    return this.hubsService.remove(id);
  }
};
exports.HubsController = HubsController;
__decorate(
  [
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new hub' }),
    (0, swagger_1.ApiResponse)({
      status: 201,
      description: 'Hub created successfully',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [create_hub_dto_1.CreateHubDto]),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all hubs' }),
    (0, swagger_1.ApiResponse)({
      status: 200,
      description: 'List of all hubs',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hub by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hub details' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hub by code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hub details' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('code')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'findByCode',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hub statistics' }),
    (0, swagger_1.ApiResponse)({
      status: 200,
      description: 'Hub statistics including student and course counts',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'getStatistics',
  null,
);
__decorate(
  [
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update hub' }),
    (0, swagger_1.ApiResponse)({
      status: 200,
      description: 'Hub updated successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, update_hub_dto_1.UpdateHubDto]),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete hub' }),
    (0, swagger_1.ApiResponse)({
      status: 200,
      description: 'Hub deleted successfully',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  HubsController.prototype,
  'remove',
  null,
);
exports.HubsController = HubsController = __decorate(
  [
    (0, swagger_1.ApiTags)('hubs'),
    (0, common_1.Controller)('api/hubs'),
    __metadata('design:paramtypes', [hubs_service_1.HubsService]),
  ],
  HubsController,
);
//# sourceMappingURL=hubs.controller.js.map
