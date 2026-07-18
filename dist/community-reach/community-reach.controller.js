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
exports.CommunityReachController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const community_reach_service_1 = require('./community-reach.service');
const create_community_reach_dto_1 = require('./dto/create-community-reach.dto');
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
      'Only admins and hub managers can manage community reach records',
    );
  }
}
let CommunityReachController = class CommunityReachController {
  constructor(communityReachService) {
    this.communityReachService = communityReachService;
  }
  findAll(hubId, reachMethod) {
    return this.communityReachService.findAll({
      hubId: hubId ? parseInt(hubId, 10) : undefined,
      reachMethod,
    });
  }
  getStats() {
    return this.communityReachService.getStats();
  }
  findOne(id) {
    return this.communityReachService.findOne(id);
  }
  create(dto, req) {
    requireAdminOrHubManager(req);
    return this.communityReachService.create(
      dto,
      req.user?.id ?? req.user?.userId,
    );
  }
  update(id, dto, req) {
    requireAdminOrHubManager(req);
    return this.communityReachService.update(id, dto);
  }
  remove(id, req) {
    requireAdminOrHubManager(req);
    return this.communityReachService.remove(id);
  }
};
exports.CommunityReachController = CommunityReachController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('hubId')),
    __param(1, (0, common_1.Query)('reachMethod')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String]),
    __metadata('design:returntype', void 0),
  ],
  CommunityReachController.prototype,
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
  CommunityReachController.prototype,
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
  CommunityReachController.prototype,
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
      create_community_reach_dto_1.CreateCommunityReachDto,
      Object,
    ]),
    __metadata('design:returntype', void 0),
  ],
  CommunityReachController.prototype,
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
      create_community_reach_dto_1.CreateCommunityReachDto,
      Object,
    ]),
    __metadata('design:returntype', void 0),
  ],
  CommunityReachController.prototype,
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
  CommunityReachController.prototype,
  'remove',
  null,
);
exports.CommunityReachController = CommunityReachController = __decorate(
  [
    (0, swagger_1.ApiTags)('community-reach'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/community-reach'),
    __metadata('design:paramtypes', [
      community_reach_service_1.CommunityReachService,
    ]),
  ],
  CommunityReachController,
);
//# sourceMappingURL=community-reach.controller.js.map
