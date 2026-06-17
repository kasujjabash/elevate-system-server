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
exports.HubsModule = void 0;
const common_1 = require('@nestjs/common');
const axios_1 = require('@nestjs/axios');
const hubs_service_1 = require('./hubs.service');
const hubs_controller_1 = require('./hubs.controller');
const typeorm_1 = require('@nestjs/typeorm');
const prisma_service_1 = require('../shared/prisma.service');
let HubsModule = class HubsModule {};
exports.HubsModule = HubsModule;
exports.HubsModule = HubsModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([])],
      providers: [hubs_service_1.HubsService, prisma_service_1.PrismaService],
      controllers: [hubs_controller_1.HubsController],
      exports: [hubs_service_1.HubsService],
    }),
  ],
  HubsModule,
);
//# sourceMappingURL=hubs.module.js.map
