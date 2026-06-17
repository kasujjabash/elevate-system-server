'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AppModule = void 0;
const common_1 = require('@nestjs/common');
const core_1 = require('@nestjs/core');
const auth_controller_1 = require('./auth/auth.controller');
const app_service_1 = require('./app.service');
const users_module_1 = require('./users/users.module');
const config_1 = require('@nestjs/config');
const typeorm_1 = require('@nestjs/typeorm');
const auth_module_1 = require('./auth/auth.module');
const hubs_module_1 = require('./hubs/hubs.module');
const attendance_module_1 = require('./attendance/attendance.module');
const courses_module_1 = require('./courses/courses.module');
const announcements_module_1 = require('./announcements/announcements.module');
const students_module_1 = require('./students/students.module');
const classes_module_1 = require('./classes/classes.module');
const dashboard_module_1 = require('./dashboard/dashboard.module');
const config_2 = require('./config');
const seed_module_1 = require('./seed/seed.module');
const vendor_module_1 = require('./vendor/vendor.module');
const chat_module_1 = require('./chat/chat.module');
const help_module_1 = require('./help/help.module');
const tenants_module_1 = require('./tenants/tenants.module');
const workshops_module_1 = require('./workshops/workshops.module');
const notifications_module_1 = require('./notifications/notifications.module');
const tenant_entity_1 = require('./tenants/entities/tenant.entity');
const tenant_header_middleware_1 = require('./middleware/tenant-header.middleware');
const jwt_auth_guard_1 = require('./auth/guards/jwt-auth.guard');
let AppModule = class AppModule {
  configure(consumer) {
    consumer
      .apply(tenant_header_middleware_1.TenantHeaderMiddleware)
      .forRoutes(
        'api/auth/login',
        'api/auth/forgot-password',
        'api/auth/reset-password/:token',
        'api/register',
        'api/tenants',
        'api/tenants/seed',
      );
  }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate(
  [
    (0, common_1.Global)(),
    (0, common_1.Module)({
      imports: [
        config_1.ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
        }),
        typeorm_1.TypeOrmModule.forRoot({
          ...config_2.default.database,
          entities: [...config_2.appEntities, tenant_entity_1.Tenant],
          schema: 'public',
        }),
        users_module_1.UsersModule,
        auth_module_1.AuthModule,
        hubs_module_1.HubsModule,
        courses_module_1.CoursesModule,
        students_module_1.StudentsModule,
        announcements_module_1.AnnouncementsModule,
        workshops_module_1.WorkshopsModule,
        seed_module_1.SeedModule,
        vendor_module_1.VendorModule,
        chat_module_1.ChatModule,
        help_module_1.HelpModule,
        tenants_module_1.TenantsModule,
        dashboard_module_1.DashboardModule,
        classes_module_1.ClassesModule,
        attendance_module_1.AttendanceModule,
        notifications_module_1.NotificationsModule,
      ],
      exports: [app_service_1.AppService],
      controllers: [auth_controller_1.AuthController],
      providers: [
        app_service_1.AppService,
        {
          provide: core_1.APP_GUARD,
          useClass: jwt_auth_guard_1.JwtAuthGuard,
        },
      ],
    }),
  ],
  AppModule,
);
//# sourceMappingURL=app.module.js.map
