import { UssdRequestDto } from './dto/ussd-request.dto';
import { SessionService } from './session.service';
import { ChatNode } from './entities/chat-node.entity';
import { ModuleRef } from '@nestjs/core';
export declare class BotService {
  private sessionService;
  private moduleRef;
  constructor(sessionService: SessionService, moduleRef: ModuleRef);
  process(request: UssdRequestDto): Promise<ChatNode>;
  private getHandlerService;
  private errorChatNode;
}
