import { Global, Module, MiddlewareConsumer } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthController } from "./auth/auth.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { CrmModule } from "./crm/crm.module";
import { GroupsModule } from "./groups/groups.module";
import config, { appEntities } from "./config";
import { SeedModule } from "./seed/seed.module";
import { VendorModule } from "./vendor/vendor.module";
import { EventsModule } from "./events/events.module";
import { ChatModule } from "./chat/chat.module";
import { HelpModule } from "./help/help.module";
import { TenantsModule } from "./tenants/tenants.module";
import { ReportsModule } from "./reports/reports.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { SearchModule } from "./search/search.module";
import { Tenant } from "./tenants/entities/tenant.entity";
import { TenantHeaderMiddleware } from "./middleware/tenant-header.middleware";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

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
    UsersModule,
    AuthModule,
    CrmModule,
    GroupsModule,
    SeedModule,
    VendorModule,
    EventsModule,

    ChatModule,
    HelpModule,
    TenantsModule, 
    ReportsModule,
    DashboardModule,
    SearchModule,
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
