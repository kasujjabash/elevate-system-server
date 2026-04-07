import { Controller, Get, Request, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../utils/sentry.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CoursesService } from '../courses/courses.service';

@UseInterceptors(SentryInterceptor)
@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('hub-stats')
  async getHubStats() {
    return this.dashboardService.getHubStats();
  }

  @Get('stats/top-performers')
  async getTopPerformers() {
    return this.dashboardService.getTopPerformers();
  }

  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummary(null);
  }

  @Get('report-stats')
  async getReportStats() {
    return this.dashboardService.getReportStats();
  }

  /** GET /api/dashboard/trainer-stats — scoped to logged-in trainer */
  @Get('trainer-stats')
  async getTrainerStats(@Request() req: any) {
    const contactId = req?.user?.contactId;
    if (!contactId)
      return {
        courses: 0,
        activeStudents: 0,
        classesToday: 0,
        todayAttendance: 0,
        pendingSubmissions: 0,
        liveSessions: [],
      };
    return this.coursesService.getTrainerStats(Number(contactId));
  }
}
