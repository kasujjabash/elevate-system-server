import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SentryInterceptor } from '../utils/sentry.interceptor';
import { ChatService } from './chat.service';
import { ChatRoomsService } from './chat-rooms.service';
import mailChatDto from './dto/sendMail.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@UseInterceptors(SentryInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('api/chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatRoomsService: ChatRoomsService,
  ) {}

  // ── Rooms ──────────────────────────────────────────────────────────────────

  @Get('rooms')
  getRooms(@Request() req: any) {
    return this.chatRoomsService.getRooms(req.user.id);
  }

  @Post('rooms')
  createRoom(@Request() req: any, @Body() body: any) {
    return this.chatRoomsService.createRoom(req.user.id, body);
  }

  @Get('rooms/:id/messages')
  getMessages(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.chatRoomsService.getMessages(id, req.user.id);
  }

  @Post('rooms/:id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body('content') content: string,
  ) {
    return this.chatRoomsService.sendMessage(id, req.user.id, content);
  }

  // ── Contacts ───────────────────────────────────────────────────────────────

  @Get('contacts')
  getContacts(@Request() req: any) {
    return this.chatRoomsService.getContacts(req.user.id, req.user.roles ?? []);
  }

  // ── Email (existing) ───────────────────────────────────────────────────────

  @Post('/email')
  sendEmail(@Body() createEmailDto: mailChatDto) {
    return this.chatService.mailAll(createEmailDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
