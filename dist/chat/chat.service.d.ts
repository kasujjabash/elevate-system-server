import { Connection } from 'typeorm';
import mailChatDto from './dto/sendMail.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
export declare class ChatService {
  private readonly emailRepository;
  constructor(connection: Connection);
  mailAll(data: mailChatDto): Promise<void>;
  sendMailToMember(to: string, subject: string, body: string): Promise<void>;
  findAll(): string;
  findOne(id: number): string;
  update(id: number, updateChatDto: UpdateChatDto): string;
  remove(id: number): string;
}
