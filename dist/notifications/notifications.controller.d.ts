import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
  private readonly notificationsService;
  constructor(notificationsService: NotificationsService);
  getMyNotifications(req: any): Promise<
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
  markAllRead(req: any): Promise<{
    success: boolean;
  }>;
  markRead(
    id: number,
    req: any,
  ): Promise<{
    success: boolean;
  }>;
}
