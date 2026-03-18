import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../utils/sentry.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@UseInterceptors(SentryInterceptor)
@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

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
}
