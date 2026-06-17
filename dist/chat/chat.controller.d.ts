import { ChatService } from './chat.service';
import { ChatRoomsService } from './chat-rooms.service';
import mailChatDto from './dto/sendMail.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
export declare class ChatController {
  private readonly chatService;
  private readonly chatRoomsService;
  constructor(chatService: ChatService, chatRoomsService: ChatRoomsService);
  getRooms(req: any): Promise<
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
    req: any,
    body: any,
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
    id: number,
    req: any,
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
    id: number,
    req: any,
    content: string,
  ): Promise<{
    id: number;
    createdAt: Date;
    content: string;
    senderId: number;
    roomId: number;
  }>;
  getContacts(req: any): Promise<
    {
      id: number;
      name: string;
      email: string;
      avatar: string;
      roles: string;
    }[]
  >;
  sendEmail(createEmailDto: mailChatDto): Promise<void>;
  findAll(): string;
  findOne(id: string): string;
  update(id: string, updateChatDto: UpdateChatDto): string;
  remove(id: string): string;
}
