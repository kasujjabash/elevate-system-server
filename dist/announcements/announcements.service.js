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
exports.AnnouncementsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let AnnouncementsService = class AnnouncementsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async findActive() {
    const now = new Date();
    return this.prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }
  async findAll() {
    return this.prisma.announcement.findMany({
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }
  async create(dto, createdBy) {
    const announcement = await this.prisma.announcement.create({
      data: {
        title: dto.title,
        body: dto.body,
        type: dto.type || 'info',
        pinned: dto.pinned ?? false,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        createdBy: createdBy ?? null,
      },
    });
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    if (users.length) {
      await this.prisma.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          title: 'New Announcement',
          message: dto.title,
          type: 'announcement',
          relatedId: announcement.id,
          relatedType: 'announcement',
        })),
      });
    }
    return announcement;
  }
  async setActive(id, isActive) {
    const a = await this.prisma.announcement.findUnique({ where: { id } });
    if (!a) throw new common_1.NotFoundException('Announcement not found');
    return this.prisma.announcement.update({
      where: { id },
      data: { isActive },
    });
  }
  async remove(id) {
    const a = await this.prisma.announcement.findUnique({ where: { id } });
    if (!a) throw new common_1.NotFoundException('Announcement not found');
    return this.prisma.announcement.delete({ where: { id } });
  }
  async getUpcomingEvents(days = 60) {
    const now = new Date();
    const until = new Date(now);
    until.setDate(until.getDate() + days);
    return this.prisma.calendar_event.findMany({
      where: {
        isActive: true,
        eventDate: { gte: now, lte: until },
      },
      orderBy: { eventDate: 'asc' },
    });
  }
  async getAllEvents() {
    return this.prisma.calendar_event.findMany({
      orderBy: { eventDate: 'asc' },
    });
  }
  async createEvent(dto, createdBy) {
    return this.prisma.calendar_event.create({
      data: {
        title: dto.title,
        description: dto.description,
        eventDate: new Date(dto.eventDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        location: dto.location,
        type: dto.type || 'general',
        createdBy: createdBy ?? null,
      },
    });
  }
  async removeEvent(id) {
    const e = await this.prisma.calendar_event.findUnique({ where: { id } });
    if (!e) throw new common_1.NotFoundException('Event not found');
    return this.prisma.calendar_event.delete({ where: { id } });
  }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  AnnouncementsService,
);
//# sourceMappingURL=announcements.service.js.map
