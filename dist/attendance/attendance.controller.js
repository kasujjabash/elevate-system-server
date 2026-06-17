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
exports.AttendanceController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const attendance_service_1 = require('./attendance.service');
const create_session_dto_1 = require('./dto/create-session.dto');
let AttendanceController = class AttendanceController {
  constructor(attendanceService) {
    this.attendanceService = attendanceService;
  }
  async createSession(dto, req) {
    const userId = req.user?.id ?? req.user?.userId ?? null;
    return this.attendanceService.createSession(dto, userId);
  }
  async getSessions(page = '1', limit = '20') {
    return this.attendanceService.getSessions(+page, +limit);
  }
  async getStudentSummary(contactId, days = '7') {
    return this.attendanceService.getStudentSummary(
      contactId,
      parseInt(days, 10),
    );
  }
  async getStudentHistory(contactId) {
    return this.attendanceService.getStudentHistory(contactId);
  }
  async getSession(id) {
    return this.attendanceService.getSession(id);
  }
  async closeSession(id) {
    return this.attendanceService.closeSession(id);
  }
  async checkIn(token, req) {
    const contactId = req.user?.contactId;
    return this.attendanceService.checkIn(token, contactId);
  }
  async checkInByCode(body, req) {
    const contactId = req.user?.contactId;
    return this.attendanceService.checkInByCode(body.code, contactId);
  }
  async getSessionByToken(token) {
    return this.attendanceService.getSessionByToken(token);
  }
  async getStats(hubId, courseId) {
    return this.attendanceService.getStats(
      hubId ? Number(hubId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
  }
  async addManual(id, body) {
    return this.attendanceService.addManual(id, body.studentId);
  }
};
exports.AttendanceController = AttendanceController;
__decorate(
  [
    (0, common_1.Post)('sessions'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      create_session_dto_1.CreateSessionDto,
      Object,
    ]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'createSession',
  null,
);
__decorate(
  [
    (0, common_1.Get)('sessions'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'getSessions',
  null,
);
__decorate(
  [
    (0, common_1.Get)('student-summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('contactId')),
    __param(1, (0, common_1.Query)('days')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, Object]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'getStudentSummary',
  null,
);
__decorate(
  [
    (0, common_1.Get)('student-history'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('contactId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'getStudentHistory',
  null,
);
__decorate(
  [
    (0, common_1.Get)('sessions/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'getSession',
  null,
);
__decorate(
  [
    (0, common_1.Patch)('sessions/:id/close'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'closeSession',
  null,
);
__decorate(
  [
    (0, common_1.Post)('checkin/:token'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, Object]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'checkIn',
  null,
);
__decorate(
  [
    (0, common_1.Post)('checkin-code'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'checkInByCode',
  null,
);
__decorate(
  [
    (0, common_1.Get)('session/:token'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('token')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'getSessionByToken',
  null,
);
__decorate(
  [
    (0, common_1.Get)('stats'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('hubId')),
    __param(1, (0, common_1.Query)('courseId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'getStats',
  null,
);
__decorate(
  [
    (0, common_1.Post)('sessions/:id/manual'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  AttendanceController.prototype,
  'addManual',
  null,
);
exports.AttendanceController = AttendanceController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiTags)('Attendance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/attendance'),
    __metadata('design:paramtypes', [attendance_service_1.AttendanceService]),
  ],
  AttendanceController,
);
//# sourceMappingURL=attendance.controller.js.map
