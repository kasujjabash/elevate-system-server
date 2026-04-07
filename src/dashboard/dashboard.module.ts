import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { CoursesService } from '../courses/courses.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService, CoursesService, PrismaService],
  exports: [DashboardService],
})
export class DashboardModule {}
