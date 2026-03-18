import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('classes')
@Controller('api/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  // GET /api/classes/class
  @Get('class')
  @ApiOperation({ summary: 'List classes/sessions' })
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('hubId') hubId?: string,
    @Query('courseId') courseId?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.classesService.findAll({
      from,
      to,
      hubId,
      courseId,
      limit: parseInt(limit || '100', 10),
      skip: parseInt(skip || '0', 10),
    });
  }

  // POST /api/classes/class
  @Post('class')
  @ApiOperation({ summary: 'Create a class session' })
  create(@Body() body: any) {
    return this.classesService.create(body);
  }

  // GET /api/classes/member?contactId=uuid
  @Get('member')
  @ApiOperation({ summary: 'Get classes a student attended' })
  getMember(@Query('contactId') contactId?: string) {
    return [];
  }

  // GET /api/classes/attendance?classId=uuid
  @Get('attendance')
  getAttendance(@Query('classId') classId?: string) {
    return [];
  }

  // POST /api/classes/attendance
  @Post('attendance')
  markAttendance(@Body() body: { classId: string; studentIds: string[] }) {
    return { marked: body.studentIds?.length || 0 };
  }

  // GET /api/classes/registration
  @Get('registration')
  getRegistrations(
    @Query('classId') classId?: string,
    @Query('contactId') contactId?: string,
  ) {
    return [];
  }

  // POST /api/classes/registration
  @Post('registration')
  register(@Body() body: any) {
    return { message: 'Registered' };
  }

  // GET /api/classes/category
  @Get('category')
  getCategories() {
    return [];
  }

  // GET /api/classes/fields
  @Get('fields')
  getFields() {
    return [];
  }

  // GET /api/classes/activities
  @Get('activities')
  getActivities() {
    return [];
  }

  // GET /api/classes/metrics/raw
  @Get('metrics/raw')
  getMetricsRaw(@Query('from') from?: string, @Query('to') to?: string) {
    return this.classesService.getMetricsRaw(from, to);
  }

  // GET /api/classes/dayoff
  @Get('dayoff')
  getDaysOff() {
    return [];
  }
}
