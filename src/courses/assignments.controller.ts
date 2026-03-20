import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('assignments')
@UseGuards(JwtAuthGuard)
@Controller('api/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // ── Admin/Trainer: create an assignment ─────────────────────────────────
  // POST /api/assignments
  @Post()
  create(@Body() dto: any) {
    return this.assignmentsService.create(dto);
  }

  // ── List assignments ─────────────────────────────────────────────────────
  // GET /api/assignments?contactId=3   → student view (all with submission status)
  // GET /api/assignments?courseId=5    → admin/trainer view (by course)
  // GET /api/assignments               → admin view (all)
  @Get()
  findAll(
    @Query('contactId') contactId?: string,
    @Query('courseId') courseId?: string,
    @Request() req?: any,
  ) {
    if (contactId)
      return this.assignmentsService.findByContact(parseInt(contactId, 10));
    if (courseId)
      return this.assignmentsService.findByCourse(parseInt(courseId, 10));
    return this.assignmentsService.findAll();
  }

  // ── Student: get own assignments (uses JWT contactId) ────────────────────
  // GET /api/assignments/mine
  @Get('mine')
  getMyAssignments(@Request() req: any) {
    return this.assignmentsService.findByContact(req.user.contactId);
  }

  // ── Admin: get all submissions for an assignment ─────────────────────────
  // GET /api/assignments/:id/submissions
  @Get(':id/submissions')
  getSubmissions(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.getSubmissions(id);
  }

  // ── Student: submit an assignment ────────────────────────────────────────
  // POST /api/assignments/:id/submissions
  @Post(':id/submissions')
  submit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req: any,
  ) {
    // Use JWT contactId so students can only submit as themselves
    return this.assignmentsService.submitAssignment(
      id,
      req.user.contactId,
      body,
    );
  }

  // ── Admin/Trainer: grade a submission ────────────────────────────────────
  // PATCH /api/assignments/submissions/:submissionId/grade
  @Patch('submissions/:submissionId/grade')
  grade(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() dto: { score: number; feedback?: string },
  ) {
    return this.assignmentsService.gradeSubmission(submissionId, dto);
  }

  // ── GET single assignment ─────────────────────────────────────────────────
  // GET /api/assignments/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }
}
