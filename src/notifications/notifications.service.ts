import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: number, userId: number) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async markAllRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async createForUsers(
    userIds: number[],
    data: {
      title: string;
      message: string;
      type?: string;
      relatedId?: number;
      relatedType?: string;
    },
  ) {
    if (!userIds.length) return;
    await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        title: data.title,
        message: data.message,
        type: data.type ?? 'info',
        relatedId: data.relatedId ?? null,
        relatedType: data.relatedType ?? null,
      })),
    });
  }
}
