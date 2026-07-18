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
exports.DashboardModule = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
const dashboard_controller_1 = require('./dashboard.controller');
const dashboard_service_1 = require('./dashboard.service');
const courses_service_1 = require('../courses/courses.service');
const community_reach_service_1 = require('../community-reach/community-reach.service');
const job_placements_service_1 = require('../job-placements/job-placements.service');
const attendance_service_1 = require('../attendance/attendance.service');
let DashboardModule = class DashboardModule {};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [],
      controllers: [dashboard_controller_1.DashboardController],
      providers: [
        dashboard_service_1.DashboardService,
        courses_service_1.CoursesService,
        community_reach_service_1.CommunityReachService,
        job_placements_service_1.JobPlacementsService,
        attendance_service_1.AttendanceService,
        prisma_service_1.PrismaService,
      ],
      exports: [dashboard_service_1.DashboardService],
    }),
  ],
  DashboardModule,
);
//# sourceMappingURL=dashboard.module.js.map
