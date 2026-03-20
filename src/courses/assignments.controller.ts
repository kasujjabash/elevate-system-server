import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('assignments')
@Controller('api/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // GET /api/assignments?contactId=3
  @Get()
  findAll(
    @Query('contactId') contactId?: string,
    @Query('courseId') courseId?: string,
  ) {
    if (contactId)
      return this.assignmentsService.findByContact(parseInt(contactId, 10));
    if (courseId)
      return this.assignmentsService.findByCourse(parseInt(courseId, 10));
    return [];
  }

  // GET /api/assignments/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }

  // POST /api/assignments
  @Post()
  create(@Body() dto: any) {
    return this.assignmentsService.create(dto);
  }

  // POST /api/assignments/:id/submit
  @Post(':id/submit')
  submit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { studentId: number; content?: string; filePath?: string },
  ) {
    return this.assignmentsService.submitAssignment(id, body.studentId, body);
  }
}
