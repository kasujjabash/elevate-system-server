import { Connection } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { ChatNode } from './entities/chat-node.entity';
import { UssdRequestDto } from './dto/ussd-request.dto';
export declare class SessionService {
  private readonly sessionRepository;
  private readonly chatNodeRepository;
  constructor(connection: Connection);
  loadSession(request: UssdRequestDto): Promise<ChatSession>;
  createNode(node: ChatNode): Promise<ChatNode>;
  updateSession(session: ChatSession, node: ChatNode): Promise<void>;
  popChatNode(session: ChatSession): Promise<ChatNode>;
}
