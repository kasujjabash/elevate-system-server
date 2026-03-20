import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  // ── Students: get active, non-expired announcements ─────────────────────
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

  // ── Admin: get all announcements (including inactive) ─────────────────
  async findAll() {
    return this.prisma.announcement.findMany({
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // ── Admin: create an announcement ────────────────────────────────────────
  async create(
    dto: {
      title: string;
      body: string;
      type?: string;
      pinned?: boolean;
      expiresAt?: string;
    },
    createdBy?: number,
  ) {
    return this.prisma.announcement.create({
      data: {
        title: dto.title,
        body: dto.body,
        type: dto.type || 'info',
        pinned: dto.pinned ?? false,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        createdBy: createdBy ?? null,
      },
    });
  }

  // ── Admin: toggle active/inactive ────────────────────────────────────────
  async setActive(id: number, isActive: boolean) {
    const a = await this.prisma.announcement.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.update({
      where: { id },
      data: { isActive },
    });
  }

  // ── Admin: delete permanently ─────────────────────────────────────────────
  async remove(id: number) {
    const a = await this.prisma.announcement.findUnique({ where: { id } });
    if (!a) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.delete({ where: { id } });
  }

  // ════════════════════════════════════════════════════════
  // CALENDAR EVENTS
  // ════════════════════════════════════════════════════════

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

  async createEvent(
    dto: {
      title: string;
      description?: string;
      eventDate: string;
      endDate?: string;
      location?: string;
      type?: string;
    },
    createdBy?: number,
  ) {
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

  async removeEvent(id: number) {
    const e = await this.prisma.calendar_event.findUnique({ where: { id } });
    if (!e) throw new NotFoundException('Event not found');
    return this.prisma.calendar_event.delete({ where: { id } });
  }
}
