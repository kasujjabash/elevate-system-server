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
  HttpException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  // GET /api/assignments               → admin/trainer view (all, scoped by DB for trainers)
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
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');

    // Admins/super-admins/hub-managers see everything.
    // Everyone else (trainers, stale JWTs with no roles) is always scoped to
    // courses they actually teach — determined from the DB, not the JWT.
    if (!isAdmin) {
      const trainerContactId = req.user.contactId ?? req.user.id ?? null;
      return this.assignmentsService.findAllForTrainer(
        trainerContactId,
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

  // ── Admin/Trainer: get submissions for an assignment (trainer-scoped) ───────
  // GET /api/assignments/:id/submissions
  @Get(':id/submissions')
  async getSubmissions(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const roles: string[] = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r: string) => r.trim())
          .filter(Boolean);
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');

    if (!isAdmin) {
      // Verify the requesting trainer owns the course this assignment belongs to
      const trainerContactId = req.user.contactId ?? req.user.id ?? null;
      const owns = await this.assignmentsService.trainerOwnsAssignment(
        trainerContactId,
        id,
      );
      if (!owns) return [];
    }

    return this.assignmentsService.getSubmissions(id);
  }

  // ── Student: submit an assignment (text / link) ──────────────────────────
  // POST /api/assignments/:id/submissions
  @Post(':id/submissions')
  submit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.assignmentsService.submitAssignment(
      id,
      req.user.contactId,
      body,
    );
  }

  // ── Student: submit an assignment (file upload) ───────────────────────────
  // POST /api/assignments/:id/submissions/file
  @Post(':id/submissions/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/assignments',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    }),
  )
  submitFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) throw new HttpException('No file uploaded', 400);
    return this.assignmentsService.submitAssignment(id, req.user.contactId, {
      type: 'file',
      fileName: file.originalname,
      filePath: `/uploads/assignments/${file.filename}`,
    });
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

  // ── Admin/Trainer: list submissions (trainer-scoped unless admin) ────────
  // GET /api/assignments/submissions?status=submitted&limit=100
  @Get('submissions')
  getAllSubmissions(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('courseId') courseId?: string,
    @Query('instructorId') instructorId?: string,
  ) {
    const roles: string[] = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r: string) => r.trim())
          .filter(Boolean);
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');

    // Non-admins are always scoped to their own courses — ignore any
    // instructorId query param and use the JWT contactId instead.
    const effectiveInstructorContactId = isAdmin
      ? instructorId
        ? parseInt(instructorId, 10)
        : undefined
      : req.user.contactId ?? req.user.id ?? undefined;

    return this.assignmentsService.getAllSubmissions({
      status,
      limit: limit ? parseInt(limit, 10) : 50,
      courseId,
      instructorContactId: effectiveInstructorContactId,
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

  // POST /api/assignments/grades  — grade a submission via body
  @Post('grades')
  gradeByBody(
    @Body() dto: { submissionId: number; score: number; feedback?: string },
  ) {
    return this.assignmentsService.gradeByBody(dto);
  }

  // POST /api/assignments/submissions/:id/like  — trainer likes/acknowledges a submission
  @Post('submissions/:id/like')
  likeSubmission(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.likeSubmission(id);
  }

  // ── GET single assignment ─────────────────────────────────────────────────
  // GET /api/assignments/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }
}
