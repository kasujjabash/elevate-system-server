import { Global, Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// School-specific modules
import { HubsModule } from './hubs/hubs.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CoursesModule } from './courses/courses.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { DashboardModule } from './dashboard/dashboard.module';
// Keeping useful modules
import config, { appEntities } from './config';
import { SeedModule } from './seed/seed.module';
import { VendorModule } from './vendor/vendor.module';
import { ChatModule } from './chat/chat.module';
import { HelpModule } from './help/help.module';
import { TenantsModule } from './tenants/tenants.module';
import { WorkshopsModule } from './workshops/workshops.module';
import { Tenant } from './tenants/entities/tenant.entity';
import { TenantHeaderMiddleware } from './middleware/tenant-header.middleware';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      ...config.database,
      entities: [...appEntities, Tenant],
      schema: 'public', // Use public schema for row-level multi-tenancy
    }),
    // Core modules
    UsersModule,
    AuthModule,
    // CrmModule, // Temporarily disabled due to group dependencies

    // School-specific modules
    HubsModule,
    CoursesModule,
    StudentsModule,
    AnnouncementsModule,
    WorkshopsModule,

    // Supporting modules
    SeedModule,
    VendorModule,
    ChatModule,
    HelpModule,
    TenantsModule,
    DashboardModule,
    ClassesModule,
    AttendanceModule,
    // SearchModule, // Temporarily disabled due to group dependencies
  ],
  exports: [AppService],
  controllers: [AuthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TenantHeaderMiddleware)
      .forRoutes(
        'api/auth/login',
        'api/auth/forgot-password',
        'api/auth/reset-password/:token',
        'api/register',
        'api/tenants',
        'api/tenants/seed',
      );
  }
}
