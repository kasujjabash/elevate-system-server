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
Object.defineProperty(exports, '__esModule', { value: true });
exports.CommunityReachModule = void 0;
const common_1 = require('@nestjs/common');
const community_reach_controller_1 = require('./community-reach.controller');
const community_reach_service_1 = require('./community-reach.service');
const prisma_service_1 = require('../shared/prisma.service');
let CommunityReachModule = class CommunityReachModule {};
exports.CommunityReachModule = CommunityReachModule;
exports.CommunityReachModule = CommunityReachModule = __decorate(
  [
    (0, common_1.Module)({
      controllers: [community_reach_controller_1.CommunityReachController],
      providers: [
        community_reach_service_1.CommunityReachService,
        prisma_service_1.PrismaService,
      ],
    }),
  ],
  CommunityReachModule,
);
//# sourceMappingURL=community-reach.module.js.map
