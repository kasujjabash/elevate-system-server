import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiTags } from '@nestjs/swagger';

const ADMIN_ROLES = ['admin', 'super_admin', 'hub_manager'];

function requireAdminOrHubManager(req: any) {
  const raw = req?.user?.roles;
  console.log(
    '[enrollGuard] user id:',
    req?.user?.id,
    '| raw roles:',
    JSON.stringify(raw),
  );
  const roles: string[] = Array.isArray(raw)
    ? raw
    : (raw || '')
        .split(',')
        .map((r: string) => r.trim())
        .filter(Boolean);
  console.log('[enrollGuard] parsed roles:', roles);
  if (!roles.some((r) => ADMIN_ROLES.includes(r.toLowerCase()))) {
    throw new ForbiddenException(
      'Only admins and hub managers can enroll students',
    );
  }
}

@ApiTags('courses')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ── Course CRUD ───────────────────────────────────────────────────────────

  // GET /api/courses  — list all courses (alias); trainers only see their own
  @Get()
  findAllRoot(
    @Request() req: any,
    @Query('hub') hub?: string,
    @Query('isActive') isActive?: string,
  ) {
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
    // contactId fallback: JWT may carry null contactId — use user.id as fallback
    const contactId = isTrainerOnly
      ? req.user.contactId ?? req.user.id ?? null
      : undefined;
    return this.coursesService.findAllForClient(hub, isActive, contactId);
  }

  // POST /api/courses  — admin: create a course (alias)
  @Post()
  createRoot(@Body() dto: any) {
    return this.coursesService.create(dto);
  }

  // GET /api/courses/course  — list all courses; trainers scoped to own
  @Get('course')
  findAll(
    @Request() req: any,
    @Query('hub') hub?: string,
    @Query('isActive') isActive?: string,
  ) {
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
    const contactId = isTrainerOnly
      ? req.user.contactId ?? req.user.id ?? null
      : undefined;
    return this.coursesService.findAllForClient(hub, isActive, contactId);
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

  // ── Enrollment ────────────────────────────────────────────────────────────

  // GET /api/courses/enrollment  — list enrollments (admin, filter by contactId)
  @Get('enrollment')
  getEnrollments(
    @Query('contactId') contactId?: string,
    @Query('groupId') groupId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.coursesService.getEnrollments(contactId, groupId ?? courseId);
  }

  // POST /api/courses/enrollment  — admin/hub-manager: enroll student by studentId or contactId
  @Post('enrollment')
  enroll(@Request() req: any, @Body() body: any) {
    requireAdminOrHubManager(req);
    return this.coursesService.enrollStudent(body);
  }

  // POST /api/courses/:id/enroll  — admin/hub-manager: enroll a student (role-guarded)
  @Post(':id/enroll')
  enrollById(
    @Request() req: any,
    @Param('id', ParseIntPipe) courseId: number,
    @Body() body: { studentId?: string; contactId?: string },
  ) {
    requireAdminOrHubManager(req);
    return this.coursesService.adminEnrollStudent(courseId, body);
  }

  // POST /api/courses/:id/admin-enroll  — admin/hub-manager: force-enroll a student
  @Post(':id/admin-enroll')
  adminEnroll(
    @Request() req: any,
    @Param('id', ParseIntPipe) courseId: number,
    @Body() body: { studentId?: string; contactId?: string },
  ) {
    requireAdminOrHubManager(req);
    return this.coursesService.adminEnrollStudent(courseId, body);
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
    @Request() req: any,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getContent(contentId, studentId ?? undefined);
  }

  // POST /api/courses/content/:contentId/complete  — mark lesson done
  @Post('content/:contentId/complete')
  async markComplete(
    @Param('contentId', ParseIntPipe) contentId: number,
    @Request() req: any,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.markContentComplete(contentId, studentId!);
  }

  // GET /api/courses/modules/:moduleId
  @Get('modules/:moduleId')
  async getModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Request() req: any,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getModule(moduleId, studentId ?? undefined);
  }

  // PATCH /api/courses/modules/:moduleId  — admin/trainer: rename a module
  @Patch('modules/:moduleId')
  updateModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Body() dto: any,
  ) {
    return this.coursesService.updateModule(moduleId, dto);
  }

  // POST /api/courses/modules/:moduleId/content  — admin: add content to module
  @Post('modules/:moduleId/content')
  createContent(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Body() dto: any,
  ) {
    return this.coursesService.createContent(moduleId, dto);
  }

  // PATCH /api/courses/content/:contentId  — admin: update content
  @Patch('content/:contentId')
  updateContent(
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() dto: any,
  ) {
    return this.coursesService.updateContent(contentId, dto);
  }

  // DELETE /api/courses/content/:contentId  — admin: remove content
  @Delete('content/:contentId')
  deleteContent(@Param('contentId', ParseIntPipe) contentId: number) {
    return this.coursesService.deleteContent(contentId);
  }

  // ── Course-level routes ───────────────────────────────────────────────────

  // GET /api/courses/:id/modules
  @Get(':id/modules')
  async getCourseModules(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getCourseModules(id, studentId ?? undefined);
  }

  // GET /api/courses/:id/progress
  @Get(':id/progress')
  async getCourseProgress(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getCourseProgress(id, studentId!);
  }

  // POST /api/courses/:id/modules  — admin: add module to course
  @Post(':id/modules')
  createModule(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.coursesService.createModule(id, dto);
  }

  // ── Resources ─────────────────────────────────────────────────────────────

  // GET /api/courses/:id/resources
  @Get(':id/resources')
  getCourseResources(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseResources(id);
  }

  // POST /api/courses/:id/resources
  @Post(':id/resources')
  addCourseResource(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.coursesService.addCourseResource(id, dto);
  }

  // DELETE /api/courses/:id/resources/:resourceId
  @Delete(':id/resources/:resourceId')
  removeCourseResource(
    @Param('id', ParseIntPipe) id: number,
    @Param('resourceId', ParseIntPipe) resourceId: number,
  ) {
    return this.coursesService.removeCourseResource(id, resourceId);
  }

  // ── Trainer stats for a course ────────────────────────────────────────────

  // GET /api/courses/:id/trainer-stats
  @Get(':id/trainer-stats')
  getCourseTrainerStats(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseTrainerStats(id);
  }

  // PUT /api/courses/:id/instructor  — assign instructor to a course
  @Put(':id/instructor')
  assignInstructor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { instructorId: number },
  ) {
    return this.coursesService.updateInstructor(id, dto.instructorId);
  }

  // GET /api/courses/:id  — single course detail (keep last)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }
}
