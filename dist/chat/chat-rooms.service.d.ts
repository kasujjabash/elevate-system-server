import { PrismaService } from '../shared/prisma.service';
export declare class ChatRoomsService {
  private prisma;
  constructor(prisma: PrismaService);
  getRooms(userId: number): Promise<
    {
      id: number;
      type: string;
      title: string;
      courseId: number;
      courseName: string;
      memberCount: number;
      participants: {
        userId: number;
        name: string;
      }[];
      lastMessage: {
        content: string;
        createdAt: Date;
      };
    }[]
  >;
  createRoom(
    userId: number,
    body: {
      type: 'group' | 'direct';
      courseId?: number;
      title?: string;
      participantId?: number;
    },
  ): Promise<
    | {
        id: number;
        type: string;
        title: string;
        courseId?: undefined;
      }
    | {
        id: number;
        type: string;
        title: string;
        courseId: number;
      }
  >;
  getMessages(
    roomId: number,
    userId: number,
  ): Promise<
    {
      id: number;
      senderId: number;
      senderName: string;
      content: string;
      createdAt: Date;
    }[]
  >;
  sendMessage(
    roomId: number,
    userId: number,
    content: string,
  ): Promise<{
    id: number;
    createdAt: Date;
    content: string;
    senderId: number;
    roomId: number;
  }>;
  getContacts(
    userId: number,
    roles: string[],
  ): Promise<
    {
      id: number;
      name: string;
      email: string;
      avatar: string;
      roles: string;
    }[]
  >;
}
