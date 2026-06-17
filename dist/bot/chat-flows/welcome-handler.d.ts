import { ChatSession } from '../entities/chat-session.entity';
import { ChatNode } from '../entities/chat-node.entity';
import { ChatHandler } from './handler-interface';
import { GoogleSheetsService } from '../google-sheets.service';
export declare class WelcomeHandler implements ChatHandler {
  message: string;
  execute(userInput: string, session: ChatSession): Promise<ChatNode>;
}
export declare class WelcomeActionHandler implements ChatHandler {
  execute(userInput: string, session: ChatSession): Promise<ChatNode>;
}
export declare class NameEnteredHandler implements ChatHandler {
  execute(userInput: string, session: ChatSession): Promise<ChatNode>;
}
export declare class AddressEnteredHandler implements ChatHandler {
  private readonly sheetsService;
  constructor(sheetsService: GoogleSheetsService);
  execute(userInput: string, session: ChatSession): Promise<ChatNode>;
  private submitToGoogleSheet;
}
