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
exports.StudentsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const platform_express_1 = require('@nestjs/platform-express');
const students_service_1 = require('./students.service');
const enrollment_service_1 = require('./enrollment.service');
const swagger_1 = require('@nestjs/swagger');
let StudentsController = class StudentsController {
  constructor(studentsService, enrollmentService) {
    this.studentsService = studentsService;
    this.enrollmentService = enrollmentService;
  }
  findAll(req, query, hub, hubId, course, dateFrom, dateTo, limit, skip) {
    const roles = req?.user?.roles || '';
    const isHubManager = roles.includes('HUB_MANAGER');
    const resolvedHubId = isHubManager
      ? req.user.hubId ?? (hubId ? parseInt(hubId, 10) : undefined)
      : hubId
      ? parseInt(hubId, 10)
      : undefined;
    return this.studentsService.findAllForClient({
      query,
      hub,
      hubId: resolvedHubId,
      course,
      dateFrom,
      dateTo,
      limit: limit ? parseInt(limit, 10) : 50,
      skip: skip ? parseInt(skip, 10) : 0,
    });
  }
  getMyCourses(req) {
    return this.studentsService.getMyCourses(req.user.id);
  }
  getMySchedule(req, from, to) {
    return this.studentsService.getStudentSchedule(req.user.id, from, to);
  }
  createPerson(body) {
    return this.studentsService.createPerson(body);
  }
  getPeople(query) {
    return this.studentsService.getPeople(query);
  }
  getPeopleCombo(skipUsers) {
    return this.studentsService.getPeopleCombo(skipUsers === 'true');
  }
  getEmails(studentId) {
    return this.studentsService.getEmails(studentId);
  }
  getPhones(studentId) {
    return this.studentsService.getPhones(studentId);
  }
  getAddresses(_studentId) {
    return [];
  }
  getIdentifications(_studentId) {
    return [];
  }
  getRequests(type, req) {
    return this.studentsService.getRequests(req?.user?.id, type);
  }
  createRequest(body, req) {
    return this.studentsService.createRequest(req?.user?.id, body);
  }
  getRequestMessages(id) {
    return this.studentsService.getRequestMessages(id);
  }
  addRequestMessage(id, body, req) {
    return this.studentsService.addRequestMessage(id, body.body, req?.user?.id);
  }
  updateAvatar(_file, _studentId) {
    return { avatarUrl: null };
  }
  importStudents(_file) {
    return { imported: 0, failed: 0, errors: [] };
  }
  findOne(id) {
    return this.studentsService.findOne(id);
  }
  update(id, body) {
    return this.studentsService.update(id, body);
  }
  getProgress(id) {
    return this.studentsService.getStudentProgress(id);
  }
  getResources(id) {
    return this.studentsService.getStudentResources(id);
  }
  enrollInCourse(studentId, courseId) {
    return this.enrollmentService.enrollStudent(studentId, courseId);
  }
};
exports.StudentsController = StudentsController;
__decorate(
  [
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all students with filters' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('hub')),
    __param(3, (0, common_1.Query)('hubId')),
    __param(4, (0, common_1.Query)('course')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __param(7, (0, common_1.Query)('limit')),
    __param(8, (0, common_1.Query)('skip')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Object,
      String,
      String,
      String,
      String,
      String,
      String,
      String,
      String,
    ]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)('me/courses'),
    (0, swagger_1.ApiOperation)({
      summary: 'Get enrolled courses for the logged-in student',
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getMyCourses',
  null,
);
__decorate(
  [
    (0, common_1.Get)('me/schedule'),
    (0, swagger_1.ApiOperation)({
      summary: 'Get schedule/calendar for the logged-in student',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getMySchedule',
  null,
);
__decorate(
  [
    (0, common_1.Post)('people'),
    (0, swagger_1.ApiOperation)({
      summary: 'Create a new student with contact, enrollment',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'createPerson',
  null,
);
__decorate(
  [
    (0, common_1.Get)('people'),
    (0, swagger_1.ApiOperation)({ summary: 'People list for autocomplete' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('query')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getPeople',
  null,
);
__decorate(
  [
    (0, common_1.Get)('people/combo'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('skipUsers')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getPeopleCombo',
  null,
);
__decorate(
  [
    (0, common_1.Get)('emails'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('studentId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getEmails',
  null,
);
__decorate(
  [
    (0, common_1.Get)('phones'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('studentId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getPhones',
  null,
);
__decorate(
  [
    (0, common_1.Get)('addresses'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('studentId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getAddresses',
  null,
);
__decorate(
  [
    (0, common_1.Get)('identifications'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('studentId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getIdentifications',
  null,
);
__decorate(
  [
    (0, common_1.Get)('requests'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getRequests',
  null,
);
__decorate(
  [
    (0, common_1.Post)('requests'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'createRequest',
  null,
);
__decorate(
  [
    (0, common_1.Get)('requests/:id/messages'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getRequestMessages',
  null,
);
__decorate(
  [
    (0, common_1.Post)('requests/:id/messages'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'addRequestMessage',
  null,
);
__decorate(
  [
    (0, common_1.Put)('student/avatar'),
    (0, common_1.UseInterceptors)(
      (0, platform_express_1.FileInterceptor)('avatar'),
    ),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('studentId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'updateAvatar',
  null,
);
__decorate(
  [
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)(
      (0, platform_express_1.FileInterceptor)('file'),
    ),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'importStudents',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student by ID' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update student' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/progress'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getProgress',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/resources'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'getResources',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':studentId/enroll/:courseId'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Number]),
    __metadata('design:returntype', void 0),
  ],
  StudentsController.prototype,
  'enrollInCourse',
  null,
);
exports.StudentsController = StudentsController = __decorate(
  [
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('api/students'),
    __metadata('design:paramtypes', [
      students_service_1.StudentsService,
      enrollment_service_1.EnrollmentService,
    ]),
  ],
  StudentsController,
);
//# sourceMappingURL=students.controller.js.map
