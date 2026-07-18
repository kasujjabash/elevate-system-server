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
exports.JobPlacementsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const job_placements_service_1 = require('./job-placements.service');
const create_job_placement_dto_1 = require('./dto/create-job-placement.dto');
const ADMIN_ROLES = ['admin', 'super_admin', 'hub_manager'];
function requireAdminOrHubManager(req) {
  const raw = req?.user?.roles;
  const roles = Array.isArray(raw)
    ? raw
    : (raw || '')
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
  if (!roles.some((r) => ADMIN_ROLES.includes(r.toLowerCase()))) {
    throw new common_1.ForbiddenException(
      'Only admins and hub managers can manage placement records',
    );
  }
}
let JobPlacementsController = class JobPlacementsController {
  constructor(jobPlacementsService) {
    this.jobPlacementsService = jobPlacementsService;
  }
  findAll() {
    return this.jobPlacementsService.findAll();
  }
  getStats() {
    return this.jobPlacementsService.getStats();
  }
  findOne(id) {
    return this.jobPlacementsService.findOne(id);
  }
  create(dto, req) {
    requireAdminOrHubManager(req);
    return this.jobPlacementsService.create(
      dto,
      req.user?.id ?? req.user?.userId,
    );
  }
  update(id, dto, req) {
    requireAdminOrHubManager(req);
    return this.jobPlacementsService.update(id, dto);
  }
  remove(id, req) {
    requireAdminOrHubManager(req);
    return this.jobPlacementsService.remove(id);
  }
};
exports.JobPlacementsController = JobPlacementsController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  JobPlacementsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)('stats'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  JobPlacementsController.prototype,
  'getStats',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  JobPlacementsController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      create_job_placement_dto_1.CreateJobPlacementDto,
      Object,
    ]),
    __metadata('design:returntype', void 0),
  ],
  JobPlacementsController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Number,
      create_job_placement_dto_1.CreateJobPlacementDto,
      Object,
    ]),
    __metadata('design:returntype', void 0),
  ],
  JobPlacementsController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  JobPlacementsController.prototype,
  'remove',
  null,
);
exports.JobPlacementsController = JobPlacementsController = __decorate(
  [
    (0, swagger_1.ApiTags)('job-placements'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/job-placements'),
    __metadata('design:paramtypes', [
      job_placements_service_1.JobPlacementsService,
    ]),
  ],
  JobPlacementsController,
);
//# sourceMappingURL=job-placements.controller.js.map
