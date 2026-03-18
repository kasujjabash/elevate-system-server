import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
// import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    /* GroupsModule */
  ],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
  exports: [DashboardService],
})
export class DashboardModule {}
