import { BotService } from './bot.service';
import { UssdRequestDto } from './dto/ussd-request.dto';
import { GoogleSheetsService } from './google-sheets.service';
export declare class BotController {
  private readonly service;
  private readonly sheetsService;
  constructor(service: BotService, sheetsService: GoogleSheetsService);
  test(): Promise<string>;
  africaZTalking(request: UssdRequestDto): Promise<string>;
}
