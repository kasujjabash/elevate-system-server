import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SentryInterceptor } from '../utils/sentry.interceptor';
import { AttendanceService } from './attendance.service';
import { CreateSessionDto } from './dto/create-session.dto';

@UseInterceptors(SentryInterceptor)
@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('api/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /** Admin/Hub Manager/Trainer: create a new QR session (scoped to own hub/courses) */
  @Post('sessions')
  async createSession(@Body() dto: CreateSessionDto, @Request() req: any) {
    const userId = req.user?.id ?? req.user?.userId ?? null;
    const roles: string[] = Array.isArray(req.user?.roles)
      ? req.user.roles
      : (req.user?.roles || '')
          .split(',')
          .map((r: string) => r.trim())
          .filter(Boolean);
    return this.attendanceService.createSession(dto, userId, {
      roles,
      contactId: req.user?.contactId,
    });
  }

  /** Admin: list all sessions (paginated), optionally scoped to a hub */
  @Get('sessions')
  async getSessions(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('hubId') hubId?: string,
  ) {
    return this.attendanceService.getSessions(
      +page,
      +limit,
      hubId ? Number(hubId) : undefined,
    );
  }

  /** Student: daily attendance count for last N days (dashboard chart) */
  @Get('student-summary')
  async getStudentSummary(
    @Query('contactId') contactId: string,
    @Query('days') days = '7',
  ) {
    return this.attendanceService.getStudentSummary(
      contactId,
      parseInt(days, 10),
    );
  }

  /** Admin: full attendance history for a student */
  @Get('student-history')
  async getStudentHistory(@Query('contactId') contactId: string) {
    return this.attendanceService.getStudentHistory(contactId);
  }

  /** Admin: get a single session with full check-in list */
  @Get('sessions/:id')
  async getSession(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.getSession(id);
  }

  /** Admin: close a session early */
  @Patch('sessions/:id/close')
  async closeSession(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.closeSession(id);
  }

  /** Student: check in via QR token */
  @Post('checkin/:token')
  async checkIn(@Param('token') token: string, @Request() req: any) {
    // JWT contains contactId — use it to find the student record
    const contactId = req.user?.contactId;
    return this.attendanceService.checkIn(token, contactId);
  }

  /** Student: check in by typing the short code */
  @Post('checkin-code')
  async checkInByCode(@Body() body: { code: string }, @Request() req: any) {
    const contactId = req.user?.contactId;
    return this.attendanceService.checkInByCode(body.code, contactId);
  }

  /** Public: validate token (so student page can show session info before checking in) */
  @Get('session/:token')
  async getSessionByToken(@Param('token') token: string) {
    return this.attendanceService.getSessionByToken(token);
  }

  /** Stats: enrolled, presentLastSession, absentLastSession, inactive */
  @Get('stats')
  async getStats(
    @Query('hubId') hubId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.attendanceService.getStats(
      hubId ? Number(hubId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
  }

  /** Admin: manually add a student to a session */
  @Post('sessions/:id/manual')
  async addManual(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { studentId: number },
  ) {
    return this.attendanceService.addManual(id, body.studentId);
  }
}
