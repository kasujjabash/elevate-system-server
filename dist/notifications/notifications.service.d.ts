import { PrismaService } from '../shared/prisma.service';
export declare class NotificationsService {
  private prisma;
  constructor(prisma: PrismaService);
  getForUser(userId: number): Promise<
    {
      id: number;
      type: string;
      title: string;
      userId: number;
      createdAt: Date;
      message: string;
      isRead: boolean;
      relatedId: number;
      relatedType: string;
    }[]
  >;
  markRead(
    id: number,
    userId: number,
  ): Promise<{
    success: boolean;
  }>;
  markAllRead(userId: number): Promise<{
    success: boolean;
  }>;
  createForUsers(
    userIds: number[],
    data: {
      title: string;
      message: string;
      type?: string;
      relatedId?: number;
      relatedType?: string;
    },
  ): Promise<void>;
}
