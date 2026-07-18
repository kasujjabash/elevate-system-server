import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CoursesService } from '../courses/courses.service';
import { CommunityReachService } from '../community-reach/community-reach.service';
import { JobPlacementsService } from '../job-placements/job-placements.service';
import { AttendanceService } from '../attendance/attendance.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    CoursesService,
    CommunityReachService,
    JobPlacementsService,
    AttendanceService,
    PrismaService,
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
