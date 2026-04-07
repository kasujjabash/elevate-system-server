import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('exams')
@Controller('api/exams')
export class ExamsController {
  @Get()
  findAll(@Query('courseId') _courseId?: string) {
    return { exams: [], total: 0 };
  }

  @Get('schedule')
  getSchedule(@Query('limit') _limit?: string) {
    return { schedule: [], total: 0 };
  }

  @Get('results')
  getResults(@Query('contactId') _contactId?: string) {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return null;
  }

  @Post()
  create(@Body() _dto: any) {
    return { message: 'Exams feature coming soon' };
  }
}
