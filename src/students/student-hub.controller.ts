import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('students')
@Controller('api/student')
export class StudentHubController {
  constructor(private readonly studentsService: StudentsService) {}

  // GET /api/student/hub – students grouped by hub
  @Get('hub')
  getByHub() {
    return this.studentsService.getStudentsByHub();
  }

  // GET /api/student/search
  @Get('search')
  search() {
    return [];
  }
}
