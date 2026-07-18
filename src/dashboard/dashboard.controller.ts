import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
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

  // These endpoints return institution-wide data (all hubs/students/courses),
  // so students must never receive a response from them — only staff roles
  // that already have access to the Reports page (ADMIN/TRAINER/HUB_MANAGER).
  private assertStaffAccess(req: any) {
    const roles: string[] = req?.user?.roles ?? [];
    const isStaff = roles.some((r) =>
      ['ADMIN', 'SUPER_ADMIN', 'TRAINER', 'INSTRUCTOR', 'HUB_MANAGER'].includes(
        r,
      ),
    );
    if (!isStaff) {
      throw new ForbiddenException('Not authorized to view this data');
    }
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    this.assertStaffAccess(req);
    return this.dashboardService.getStats();
  }

  @Get('hub-stats')
  async getHubStats(@Request() req: any) {
    this.assertStaffAccess(req);
    return this.dashboardService.getHubStats();
  }

  @Get('stats/top-performers')
  async getTopPerformers(
    @Query('hubId') hubId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.getTopPerformers(
      hubId ? Number(hubId) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('all-performance')
  async getAllPerformance(
    @Request() req: any,
    @Query('hubId') hubId?: string,
    @Query('courseId') courseId?: string,
    @Query('limit') limit?: string,
  ) {
    const user = req?.user;
    const roles: string[] = user?.roles ?? [];
    const isTrainer = roles.includes('TRAINER');
    const isHubManager = roles.includes('HUB_MANAGER');

    return this.dashboardService.getAllPerformance({
      hubId: hubId
        ? Number(hubId)
        : isHubManager && user?.hubId
        ? Number(user.hubId)
        : undefined,
      courseId: courseId ? Number(courseId) : undefined,
      instructorContactId:
        isTrainer && user?.contactId ? Number(user.contactId) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('summary')
  async getSummary(@Request() req: any) {
    this.assertStaffAccess(req);
    return this.dashboardService.getSummary(null);
  }

  @Get('report-stats')
  async getReportStats(@Request() req: any) {
    this.assertStaffAccess(req);
    return this.dashboardService.getReportStats();
  }

  @Get('admin-report')
  async getAdminReport(
    @Request() req: any,
    @Query('hubId') hubId?: string,
    @Query('courseId') courseId?: string,
  ) {
    this.assertStaffAccess(req);
    return this.dashboardService.getAdminReport(
      hubId ? Number(hubId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
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

  /** GET /api/dashboard/hub-manager-stats — scoped to logged-in hub manager */
  @Get('hub-manager-stats')
  async getHubManagerStats(@Request() req: any) {
    const hubId = req?.user?.hubId;
    if (!hubId)
      return {
        hubId: null,
        hubName: 'Your Hub',
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0,
        totalCourses: 0,
        classesToday: 0,
        todayAttendance: 0,
        recentStudents: [],
      };
    return this.dashboardService.getHubManagerStats(Number(hubId));
  }
}
