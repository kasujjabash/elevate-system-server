import { Controller, Get, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../shared/prisma.service';
import { Connection } from 'typeorm';
import { execSync } from 'child_process';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly connection: Connection,
  ) {}

  @Public()
  @Get('status')
  async getDatabaseStatus() {
    try {
      // Test database connections
      const prismaTest = await this.prismaService.hub.count();
      const typeormTest = await this.connection.query(
        'SELECT COUNT(*) FROM "user"',
      );

      return {
        success: true,
        prisma: { connected: true, hubs: prismaTest },
        typeorm: { connected: true, users: typeormTest[0].count },
        message: 'Database connections working',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
        message: 'Database connection failed',
      };
    }
  }

  @Public()
  @Post('users')
  async seedUsers() {
    try {
      // Run the specific commands we need

      // Run Prisma seed
      execSync('npm run seed:elevate', { stdio: 'inherit' });

      // Run admin seed
      execSync('npm run seed:admin', { stdio: 'inherit' });

      return {
        success: true,
        message: 'Users seeded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Seeding failed',
      };
    }
  }
}
