import { ChatSession } from '../entities/chat-session.entity';
import { ChatNode } from '../entities/chat-node.entity';
import { ChatAction } from '../dto/ussd-response.dto';
export interface ChatHandler {
  execute(userInput: string, session: ChatSession): Promise<ChatNode>;
}
declare class ChatNodeCreateModel {
  nodeAction: ChatAction;
  message: string;
  nextHandler: string;
  userInput: string;
  hasError?: boolean;
  name?: string;
}
export declare const createNode: (
  session: ChatSession,
  model: ChatNodeCreateModel,
) => ChatNode;
export declare class ExitChatHandler implements ChatHandler {
  execute(userInput: string, session: ChatSession): Promise<ChatNode>;
}
export declare const chatStrings: {
  comingSoon: string;
  invalidInput: string;
};
export {};
