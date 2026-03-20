import { Controller, Get, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('timetable')
@Controller('api/timetable')
export class TimetableController {
  constructor(private readonly classesService: ClassesService) {}

  // GET /api/timetable?studentId=3
  // GET /api/timetable?contactId=3
  @Get()
  getTimetable(
    @Query('studentId') studentId?: string,
    @Query('contactId') contactId?: string,
  ) {
    return this.classesService.getTimetable(studentId, contactId);
  }
}
