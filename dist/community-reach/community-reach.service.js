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
Object.defineProperty(exports, '__esModule', { value: true });
exports.CommunityReachService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
const INCLUDE = {
  hub: { select: { id: true, name: true } },
  event: { select: { id: true, title: true } },
};
const REACH_METHODS = ['Walk-in', 'Event', 'Referral', 'Social Media', 'Other'];
let CommunityReachService = class CommunityReachService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(dto, createdBy) {
    return this.prisma.community_reach.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        hubId: dto.hubId,
        reachMethod: dto.reachMethod,
        eventId: dto.reachMethod === 'Event' ? dto.eventId ?? null : null,
        createdBy: createdBy ?? null,
      },
      include: INCLUDE,
    });
  }
  async update(id, dto) {
    const existing = await this.prisma.community_reach.findUnique({
      where: { id },
    });
    if (!existing)
      throw new common_1.NotFoundException('Contact record not found');
    return this.prisma.community_reach.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        phone: dto.phone ?? null,
        hubId: dto.hubId,
        reachMethod: dto.reachMethod,
        eventId: dto.reachMethod === 'Event' ? dto.eventId ?? null : null,
      },
      include: INCLUDE,
    });
  }
  async findAll(filters) {
    return this.prisma.community_reach.findMany({
      where: {
        isActive: true,
        ...(filters?.hubId ? { hubId: filters.hubId } : {}),
        ...(filters?.reachMethod ? { reachMethod: filters.reachMethod } : {}),
      },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }
  async findOne(id) {
    const contact = await this.prisma.community_reach.findUnique({
      where: { id },
      include: INCLUDE,
    });
    if (!contact)
      throw new common_1.NotFoundException('Contact record not found');
    return contact;
  }
  async remove(id) {
    const contact = await this.prisma.community_reach.findUnique({
      where: { id },
    });
    if (!contact)
      throw new common_1.NotFoundException('Contact record not found');
    return this.prisma.community_reach.update({
      where: { id },
      data: { isActive: false },
    });
  }
  async getStats() {
    const contacts = await this.prisma.community_reach.findMany({
      where: { isActive: true },
      include: { hub: { select: { id: true, name: true } } },
    });
    const total = contacts.length;
    const byReachMethod = REACH_METHODS.reduce((acc, method) => {
      acc[method] = contacts.filter((c) => c.reachMethod === method).length;
      return acc;
    }, {});
    const byHub = {};
    contacts.forEach((c) => {
      const hubName = c.hub?.name ?? `Hub ${c.hubId}`;
      byHub[hubName] = (byHub[hubName] ?? 0) + 1;
    });
    return { total, byReachMethod, byHub };
  }
};
exports.CommunityReachService = CommunityReachService;
exports.CommunityReachService = CommunityReachService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  CommunityReachService,
);
//# sourceMappingURL=community-reach.service.js.map
