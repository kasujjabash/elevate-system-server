import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('announcements')
@UseGuards(JwtAuthGuard)
@Controller('api/announcements')
export class AnnouncementsController {
  constructor(private readonly svc: AnnouncementsService) {}

  // ── GET /api/announcements?all=true  (admin: all)
  // ── GET /api/announcements           (students: active only)
  @Get()
  findAll(@Query('all') all?: string) {
    return all === 'true' ? this.svc.findAll() : this.svc.findActive();
  }

  // ── POST /api/announcements  (admin creates)
  @Post()
  create(@Body() dto: any, @Request() req: any) {
    return this.svc.create(dto, req.user?.contactId);
  }

  // ── PATCH /api/announcements/:id/toggle  (admin activate/deactivate)
  @Patch(':id/toggle')
  toggle(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
  ) {
    return this.svc.setActive(id, body.isActive);
  }

  // ── DELETE /api/announcements/:id  (admin removes)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  // ════════════════════════════════════════════════════════
  // CALENDAR EVENTS
  // ════════════════════════════════════════════════════════

  // ── GET /api/announcements/events?all=true  (admin: all)
  // ── GET /api/announcements/events           (students: upcoming 60 days)
  @Get('events')
  getEvents(@Query('all') all?: string) {
    return all === 'true'
      ? this.svc.getAllEvents()
      : this.svc.getUpcomingEvents();
  }

  // ── POST /api/announcements/events  (admin creates event)
  @Post('events')
  createEvent(@Body() dto: any, @Request() req: any) {
    return this.svc.createEvent(dto, req.user?.contactId);
  }

  // ── DELETE /api/announcements/events/:id  (admin removes)
  @Delete('events/:id')
  removeEvent(@Param('id', ParseIntPipe) id: number) {
    return this.svc.removeEvent(id);
  }
}
