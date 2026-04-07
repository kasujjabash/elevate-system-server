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
  // GET /api/assignments               → admin/trainer view (all, scoped by JWT for trainers)
  @Get()
  async findAll(
    @Request() req: any,
    @Query('contactId') contactId?: string,
    @Query('courseId') courseId?: string,
  ) {
    if (contactId)
      return this.assignmentsService.findByContact(parseInt(contactId, 10));

    const roles: string[] = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r: string) => r.trim())
          .filter(Boolean);
    const isTrainerOnly =
      (roles.includes('TRAINER') || roles.includes('INSTRUCTOR')) &&
      !roles.includes('ADMIN') &&
      !roles.includes('SUPER_ADMIN');

    if (isTrainerOnly) {
      const contactId = req.user.contactId ?? req.user.id ?? null;
      return this.assignmentsService.findAllForTrainer(
        contactId,
        courseId ? parseInt(courseId, 10) : undefined,
      );
    }

    return this.assignmentsService.findAll(
      courseId ? { courseId: parseInt(courseId, 10) } : undefined,
    );
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

  // ── Admin: list all submissions across all assignments ───────────────────
  // GET /api/assignments/submissions?status=submitted&limit=100
  @Get('submissions')
  getAllSubmissions(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.assignmentsService.getAllSubmissions({
      status,
      limit: limit ? parseInt(limit, 10) : 50,
      courseId,
    });
  }

  // GET /api/assignments/files  — placeholder
  @Get('files')
  getFiles() {
    return [];
  }

  // GET /api/assignments/grades  — placeholder
  @Get('grades')
  getGrades() {
    return [];
  }

  // ── GET single assignment ─────────────────────────────────────────────────
  // GET /api/assignments/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }
}
