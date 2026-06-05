import {
  Controller,
  Get,
  Patch,
  Param,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getMyNotifications(@Request() req: any) {
    return this.notificationsService.getForUser(req.user.id);
  }

  @Patch('read-all')
  markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.notificationsService.markRead(id, req.user.id);
  }
}
