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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DashboardController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const swagger_1 = require('@nestjs/swagger');
const dashboard_service_1 = require('./dashboard.service');
const courses_service_1 = require('../courses/courses.service');
let DashboardController = class DashboardController {
  constructor(dashboardService, coursesService) {
    this.dashboardService = dashboardService;
    this.coursesService = coursesService;
  }
  assertStaffAccess(req) {
    const roles = req?.user?.roles ?? [];
    const isStaff = roles.some((r) =>
      ['ADMIN', 'SUPER_ADMIN', 'TRAINER', 'INSTRUCTOR', 'HUB_MANAGER'].includes(
        r,
      ),
    );
    if (!isStaff) {
      throw new common_1.ForbiddenException('Not authorized to view this data');
    }
  }
  async getStats(req) {
    this.assertStaffAccess(req);
    return this.dashboardService.getStats();
  }
  async getHubStats(req) {
    this.assertStaffAccess(req);
    return this.dashboardService.getHubStats();
  }
  async getTopPerformers(hubId, limit) {
    return this.dashboardService.getTopPerformers(
      hubId ? Number(hubId) : undefined,
      limit ? Number(limit) : undefined,
    );
  }
  async getAllPerformance(req, hubId, courseId, limit) {
    const user = req?.user;
    const roles = user?.roles ?? [];
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
  async getSummary(req) {
    this.assertStaffAccess(req);
    return this.dashboardService.getSummary(null);
  }
  async getReportStats(req) {
    this.assertStaffAccess(req);
    return this.dashboardService.getReportStats();
  }
  async getAdminReport(req, hubId, courseId) {
    this.assertStaffAccess(req);
    return this.dashboardService.getAdminReport(
      hubId ? Number(hubId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
  }
  async getTrainerStats(req) {
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
  async getHubManagerStats(req) {
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
};
exports.DashboardController = DashboardController;
__decorate(
  [
    (0, common_1.Get)('stats'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getStats',
  null,
);
__decorate(
  [
    (0, common_1.Get)('hub-stats'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getHubStats',
  null,
);
__decorate(
  [
    (0, common_1.Get)('stats/top-performers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('hubId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getTopPerformers',
  null,
);
__decorate(
  [
    (0, common_1.Get)('all-performance'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('hubId')),
    __param(2, (0, common_1.Query)('courseId')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String, String]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getAllPerformance',
  null,
);
__decorate(
  [
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getSummary',
  null,
);
__decorate(
  [
    (0, common_1.Get)('report-stats'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getReportStats',
  null,
);
__decorate(
  [
    (0, common_1.Get)('admin-report'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('hubId')),
    __param(2, (0, common_1.Query)('courseId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getAdminReport',
  null,
);
__decorate(
  [
    (0, common_1.Get)('trainer-stats'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getTrainerStats',
  null,
);
__decorate(
  [
    (0, common_1.Get)('hub-manager-stats'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  DashboardController.prototype,
  'getHubManagerStats',
  null,
);
exports.DashboardController = DashboardController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('api/dashboard'),
    __metadata('design:paramtypes', [
      dashboard_service_1.DashboardService,
      courses_service_1.CoursesService,
    ]),
  ],
  DashboardController,
);
//# sourceMappingURL=dashboard.controller.js.map
