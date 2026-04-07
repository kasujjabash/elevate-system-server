import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Request,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';
import { EnrollmentService } from './enrollment.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('students')
@Controller('api/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  // GET /api/students – list with filters
  @Get()
  @ApiOperation({ summary: 'Get all students with filters' })
  findAll(
    @Query('query') query?: string,
    @Query('hub') hub?: string,
    @Query('course') course?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.studentsService.findAllForClient({
      query,
      hub,
      course,
      dateFrom,
      dateTo,
      limit: limit ? parseInt(limit, 10) : 50,
      skip: skip ? parseInt(skip, 10) : 0,
    });
  }

  // GET /api/students/me/courses — enrolled courses with progress
  @Get('me/courses')
  @ApiOperation({ summary: 'Get enrolled courses for the logged-in student' })
  getMyCourses(@Request() req) {
    return this.studentsService.getMyCourses(req.user.id);
  }

  // GET /api/students/me/schedule – calendar for the logged-in student
  @Get('me/schedule')
  @ApiOperation({ summary: 'Get schedule/calendar for the logged-in student' })
  getMySchedule(
    @Request() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.studentsService.getStudentSchedule(req.user.id, from, to);
  }

  // POST /api/students/people – create a new student
  @Post('people')
  @ApiOperation({ summary: 'Create a new student with contact, enrollment' })
  createPerson(@Body() body: any) {
    return this.studentsService.createPerson(body);
  }

  // GET /api/students/people – people list for autocomplete
  @Get('people')
  @ApiOperation({ summary: 'People list for autocomplete' })
  getPeople(@Query('query') query?: string) {
    return this.studentsService.getPeople(query);
  }

  // GET /api/students/people/combo
  @Get('people/combo')
  getPeopleCombo(@Query('skipUsers') skipUsers?: string) {
    return this.studentsService.getPeopleCombo(skipUsers === 'true');
  }

  // GET /api/students/emails
  @Get('emails')
  getEmails(@Query('studentId') studentId?: string) {
    return this.studentsService.getEmails(studentId);
  }

  // GET /api/students/phones
  @Get('phones')
  getPhones(@Query('studentId') studentId?: string) {
    return this.studentsService.getPhones(studentId);
  }

  // GET /api/students/addresses
  @Get('addresses')
  getAddresses(@Query('studentId') studentId?: string) {
    return [];
  }

  // GET /api/students/identifications
  @Get('identifications')
  getIdentifications(@Query('studentId') studentId?: string) {
    return [];
  }

  // GET /api/students/requests
  @Get('requests')
  getRequests(@Query('type') type?: string, @Request() req?: any) {
    return this.studentsService.getRequests(req?.user?.id, type);
  }

  // POST /api/students/requests
  @Post('requests')
  createRequest(@Body() body: any, @Request() req?: any) {
    return this.studentsService.createRequest(req?.user?.id, body);
  }

  // GET /api/students/requests/:id/messages
  @Get('requests/:id/messages')
  getRequestMessages(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getRequestMessages(id);
  }

  // POST /api/students/requests/:id/messages
  @Post('requests/:id/messages')
  addRequestMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req?: any,
  ) {
    return this.studentsService.addRequestMessage(id, body.body, req?.user?.id);
  }

  // PUT /api/students/student/avatar
  @Put('student/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('studentId') studentId: string,
  ) {
    return { avatarUrl: null };
  }

  // POST /api/students/import
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importStudents(@UploadedFile() file: Express.Multer.File) {
    return { imported: 0, failed: 0, errors: [] };
  }

  // GET /api/students/:id – single student
  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  // PUT /api/students/:id – update student
  @Put(':id')
  @ApiOperation({ summary: 'Update student' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.studentsService.update(id, body);
  }

  @Get(':id/progress')
  getProgress(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentProgress(id);
  }

  @Get(':id/resources')
  getResources(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.getStudentResources(id);
  }

  @Post(':studentId/enroll/:courseId')
  enrollInCourse(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentService.enrollStudent(studentId, courseId);
  }
}
