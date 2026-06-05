import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TimetableService, TimetableSessionDto } from './timetable.service';

@ApiTags('timetable')
@ApiBearerAuth()
@Controller('api/timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  /**
   * GET /api/timetable/mine — student/trainer: sessions scoped to the JWT user.
   * Always returns only what belongs to the logged-in person.
   */
  @Get('mine')
  getMyTimetable(@Request() req: any) {
    return this.timetableService.findForJwtUser(req.user);
  }

  /**
   * GET /api/timetable — role-scoped: students see their enrolled courses,
   * trainers see their courses, hub managers see their hub, admins see all.
   */
  @Get()
  getTimetable(
    @Request() req: any,
    @Query('studentId') studentId?: string,
    @Query('contactId') contactId?: string,
    @Query('hubId') hubId?: string,
    @Query('courseId') courseId?: string,
  ) {
    const sid = studentId || contactId;
    if (sid) return this.timetableService.findForStudent(sid);
    return this.timetableService.findAllScoped({ hubId, courseId }, req?.user);
  }

  /** POST /api/timetable — admin: create a session */
  @Post()
  create(@Body() dto: TimetableSessionDto) {
    return this.timetableService.create(dto);
  }

  /** PUT /api/timetable/:id — admin: update a session */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<TimetableSessionDto>,
  ) {
    return this.timetableService.update(id, dto);
  }

  /** DELETE /api/timetable/:id — admin: delete a session */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timetableService.remove(id);
  }
}
