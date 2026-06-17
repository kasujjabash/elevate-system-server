import { ChatSession } from './entities/chat-session.entity';
import { ChatNode } from './entities/chat-node.entity';
import {
  AddressEnteredHandler,
  WelcomeActionHandler,
} from './chat-flows/welcome-handler';
export declare const botEntities: (typeof ChatNode | typeof ChatSession)[];
export declare const chatHandlerProviders: (
  | typeof WelcomeActionHandler
  | typeof AddressEnteredHandler
)[];
export declare function cleanUp(str: string): string;
