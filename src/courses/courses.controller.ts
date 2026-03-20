import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ── Course CRUD ───────────────────────────────────────────────────────────

  // GET /api/courses  — list all courses (alias)
  @Get()
  findAllRoot(
    @Query('hub') hub?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.coursesService.findAllForClient(hub, isActive);
  }

  // POST /api/courses  — admin: create a course (alias)
  @Post()
  createRoot(@Body() dto: any) {
    return this.coursesService.create(dto);
  }

  // GET /api/courses/course  — list all courses
  @Get('course')
  findAll(@Query('hub') hub?: string, @Query('isActive') isActive?: string) {
    return this.coursesService.findAllForClient(hub, isActive);
  }

  // POST /api/courses/course  — admin: create a course
  @Post('course')
  create(@Body() dto: any) {
    return this.coursesService.create(dto);
  }

  // PUT /api/courses/:id  — admin: update a course
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.coursesService.update(id, dto);
  }

  // PATCH /api/courses/:id/enrollable  — admin: toggle open/closed enrollment
  @Patch(':id/enrollable')
  toggleEnrollable(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.toggleEnrollable(id);
  }

  // ── Enrollment ────────────────────────────────────────────────────────────

  // GET /api/courses/enrollment  — list enrollments (admin, filter by contactId)
  @Get('enrollment')
  getEnrollments(@Query('contactId') contactId?: string) {
    return this.coursesService.getEnrollments(contactId);
  }

  // POST /api/courses/enrollment  — admin: enroll student by studentId or contactId
  @Post('enrollment')
  enroll(@Body() body: any) {
    return this.coursesService.enrollStudent(body);
  }

  // POST /api/courses/:id/enroll  — student: self-enroll using JWT
  @Post(':id/enroll')
  selfEnroll(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.coursesService.selfEnroll(req.user, id);
  }

  // GET /api/courses/enrollment/pending  — admin: list pending enrollment requests
  @Get('enrollment/pending')
  getPendingEnrollments() {
    return this.coursesService.getPendingEnrollments();
  }

  // PATCH /api/courses/enrollment/:id/approve  — admin: approve a pending request
  @Patch('enrollment/:id/approve')
  approveEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.approveEnrollment(id);
  }

  // PATCH /api/courses/enrollment/:id/reject  — admin: reject a pending request
  @Patch('enrollment/:id/reject')
  rejectEnrollment(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.rejectEnrollment(id);
  }

  // ── Combo / misc ──────────────────────────────────────────────────────────

  @Get('combo')
  combo() {
    return this.coursesService.getCombo();
  }

  @Get('coursescombo')
  coursesCombo() {
    return this.coursesService.getCombo();
  }

  @Get('coursereports')
  courseReports() {
    return this.coursesService.getCourseReports();
  }

  @Get('reportfrequency')
  reportFrequency() {
    return [];
  }

  @Get('request')
  courseRequests() {
    return [];
  }

  @Get('category')
  getCategories() {
    return [];
  }

  // GET /api/courses/instructors  — list all instructors for dropdowns
  @Get('instructors')
  getInstructors() {
    return this.coursesService.getInstructors();
  }

  // ── Content (before :id to avoid route collision) ─────────────────────────

  // GET /api/courses/content/:contentId
  @Get('content/:contentId')
  async getContent(
    @Param('contentId', ParseIntPipe) contentId: number,
    @Request() req,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getContent(contentId, studentId);
  }

  // POST /api/courses/content/:contentId/complete  — mark lesson done
  @Post('content/:contentId/complete')
  async markComplete(
    @Param('contentId', ParseIntPipe) contentId: number,
    @Request() req,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.markContentComplete(contentId, studentId);
  }

  // GET /api/courses/modules/:moduleId
  @Get('modules/:moduleId')
  async getModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Request() req,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getModule(moduleId, studentId);
  }

  // POST /api/courses/modules/:moduleId/content  — admin: add content to module
  @Post('modules/:moduleId/content')
  createContent(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Body() dto: any,
  ) {
    return this.coursesService.createContent(moduleId, dto);
  }

  // ── Course-level routes ───────────────────────────────────────────────────

  // GET /api/courses/:id/modules
  @Get(':id/modules')
  async getCourseModules(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getCourseModules(id, studentId);
  }

  // GET /api/courses/:id/progress
  @Get(':id/progress')
  async getCourseProgress(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getCourseProgress(id, studentId);
  }

  // POST /api/courses/:id/modules  — admin: add module to course
  @Post(':id/modules')
  createModule(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.coursesService.createModule(id, dto);
  }

  // GET /api/courses/:id  — single course detail (keep last)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }
}
