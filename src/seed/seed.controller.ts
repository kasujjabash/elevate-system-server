import { Controller, Get, Post, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { execSync } from 'child_process';

@Controller('api/seed')
export class SeedController {
  constructor() {}

  @Public()
  @Get('status')
  async getDatabaseStatus() {
    try {
      return {
        success: true,
        message:
          'Seed controller is working. Use POST /api/seed/users to trigger seeding.',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Seed controller error',
      };
    }
  }

  @Public()
  @Get('debug-user/:username')
  async debugUser(@Param('username') username: string) {
    try {
      // Simple SQL queries to check user and roles
      const userQuery = `SELECT u.id, u.username, u.roles as legacy_roles FROM "user" u WHERE u.username ILIKE '%${username}%'`;
      const rolesQuery = `SELECT ur.id, ur."userId", ur."rolesId", r.role FROM "user_roles" ur JOIN roles r ON ur."rolesId" = r.id WHERE ur."userId" IN (SELECT id FROM "user" WHERE username ILIKE '%${username}%')`;

      return {
        success: true,
        username: username,
        userQuery: userQuery,
        rolesQuery: rolesQuery,
        message: 'Check these queries in your database to debug role loading',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Debug failed',
      };
    }
  }

  @Public()
  @Post('users')
  async seedUsers() {
    try {
      // Run the admin seed with proper environment variables
      const result = execSync('npm run seed:admin', {
        stdio: 'pipe',
        encoding: 'utf8',
        env: {
          ...process.env,
          // Ensure the script uses the production database URL
          DB_HOST: process.env.DB_HOST || undefined,
          DB_PORT: process.env.DB_PORT || undefined,
          DB_USERNAME: process.env.DB_USERNAME || undefined,
          DB_PASSWORD: process.env.DB_PASSWORD || undefined,
          DB_DATABASE: process.env.DB_DATABASE || undefined,
          DATABASE_URL: process.env.DATABASE_URL || undefined,
        },
      });

      return {
        success: true,
        message: 'Admin users seeded successfully',
        output: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Admin seeding failed',
        output: error.stdout || '',
      };
    }
  }
}
