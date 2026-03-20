import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('exams')
@Controller('api/exams')
export class ExamsController {
  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return { exams: [], total: 0 };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return null;
  }

  @Post()
  create(@Body() dto: any) {
    return { message: 'Exams feature coming soon' };
  }
}
