import { ChatAction } from '../dto/ussd-response.dto';
import { ChatSession } from './chat-session.entity';
export declare class ChatNode {
  id: number;
  createdAt: Date;
  name: string;
  hasError: boolean;
  session?: ChatSession;
  sessionId: number;
  userInput: string;
  nodeAction: ChatAction;
  message: string;
  nextHandler: string;
  toString(): string;
}
