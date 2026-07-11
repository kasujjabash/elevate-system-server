import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateCommunityReachDto } from './dto/create-community-reach.dto';

const INCLUDE = {
  hub: { select: { id: true, name: true } },
  event: { select: { id: true, title: true } },
};

const REACH_METHODS = ['Walk-in', 'Event', 'Referral', 'Social Media', 'Other'];

@Injectable()
export class CommunityReachService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommunityReachDto, createdBy?: number) {
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

  async update(id: number, dto: CreateCommunityReachDto) {
    const existing = await this.prisma.community_reach.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Contact record not found');

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

  async findAll() {
    return this.prisma.community_reach.findMany({
      where: { isActive: true },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const contact = await this.prisma.community_reach.findUnique({
      where: { id },
      include: INCLUDE,
    });
    if (!contact) throw new NotFoundException('Contact record not found');
    return contact;
  }

  async remove(id: number) {
    const contact = await this.prisma.community_reach.findUnique({
      where: { id },
    });
    if (!contact) throw new NotFoundException('Contact record not found');
    return this.prisma.community_reach.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStats() {
    const contacts = await this.prisma.community_reach.findMany({
      where: { isActive: true },
    });

    const total = contacts.length;
    const byReachMethod = REACH_METHODS.reduce(
      (acc, method) => {
        acc[method] = contacts.filter((c) => c.reachMethod === method).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, byReachMethod };
  }
}
