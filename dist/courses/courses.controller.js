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
exports.CoursesController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const courses_service_1 = require('./courses.service');
const swagger_1 = require('@nestjs/swagger');
const ADMIN_ROLES = ['admin', 'super_admin', 'hub_manager'];
function requireAdminOrHubManager(req) {
  const raw = req?.user?.roles;
  console.log(
    '[enrollGuard] user id:',
    req?.user?.id,
    '| raw roles:',
    JSON.stringify(raw),
  );
  const roles = Array.isArray(raw)
    ? raw
    : (raw || '')
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
  console.log('[enrollGuard] parsed roles:', roles);
  if (!roles.some((r) => ADMIN_ROLES.includes(r.toLowerCase()))) {
    throw new common_1.ForbiddenException(
      'Only admins and hub managers can enroll students',
    );
  }
}
let CoursesController = class CoursesController {
  constructor(coursesService) {
    this.coursesService = coursesService;
  }
  findAllRoot(req, hub, isActive) {
    const roles = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isTrainerOnly =
      (roles.includes('TRAINER') || roles.includes('INSTRUCTOR')) &&
      !roles.includes('ADMIN') &&
      !roles.includes('SUPER_ADMIN');
    const contactId = isTrainerOnly
      ? req.user.contactId ?? req.user.id ?? null
      : undefined;
    return this.coursesService.findAllForClient(hub, isActive, contactId);
  }
  createRoot(dto) {
    return this.coursesService.create(dto);
  }
  findAll(req, hub, isActive) {
    const roles = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isTrainerOnly =
      (roles.includes('TRAINER') || roles.includes('INSTRUCTOR')) &&
      !roles.includes('ADMIN') &&
      !roles.includes('SUPER_ADMIN');
    const contactId = isTrainerOnly
      ? req.user.contactId ?? req.user.id ?? null
      : undefined;
    return this.coursesService.findAllForClient(hub, isActive, contactId);
  }
  create(dto) {
    return this.coursesService.create(dto);
  }
  update(id, dto) {
    return this.coursesService.update(id, dto);
  }
  getEnrollments(contactId, groupId, courseId) {
    return this.coursesService.getEnrollments(contactId, groupId ?? courseId);
  }
  enroll(req, body) {
    requireAdminOrHubManager(req);
    return this.coursesService.enrollStudent(body);
  }
  enrollById(req, courseId, body) {
    requireAdminOrHubManager(req);
    return this.coursesService.adminEnrollStudent(courseId, body);
  }
  adminEnroll(req, courseId, body) {
    requireAdminOrHubManager(req);
    return this.coursesService.adminEnrollStudent(courseId, body);
  }
  getPendingEnrollments() {
    return this.coursesService.getPendingEnrollments();
  }
  approveEnrollment(id) {
    return this.coursesService.approveEnrollment(id);
  }
  rejectEnrollment(id) {
    return this.coursesService.rejectEnrollment(id);
  }
  combo() {
    return this.coursesService.getCombo();
  }
  coursesCombo() {
    return this.coursesService.getCombo();
  }
  courseReports() {
    return this.coursesService.getCourseReports();
  }
  reportFrequency() {
    return [];
  }
  courseRequests() {
    return [];
  }
  getCategories() {
    return [];
  }
  getInstructors() {
    return this.coursesService.getInstructors();
  }
  async getContent(contentId, req) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getContent(contentId, studentId ?? undefined);
  }
  async markComplete(contentId, req) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.markContentComplete(contentId, studentId);
  }
  async getModule(moduleId, req) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getModule(moduleId, studentId ?? undefined);
  }
  updateModule(moduleId, dto) {
    return this.coursesService.updateModule(moduleId, dto);
  }
  createContent(moduleId, dto) {
    return this.coursesService.createContent(moduleId, dto);
  }
  updateContent(contentId, dto) {
    return this.coursesService.updateContent(contentId, dto);
  }
  deleteContent(contentId) {
    return this.coursesService.deleteContent(contentId);
  }
  async getCourseModules(id, req) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getCourseModules(id, studentId ?? undefined);
  }
  async getCourseProgress(id, req) {
    const studentId = await this.coursesService.resolveStudentId(req.user);
    return this.coursesService.getCourseProgress(id, studentId);
  }
  createModule(id, dto) {
    return this.coursesService.createModule(id, dto);
  }
  getCourseResources(id) {
    return this.coursesService.getCourseResources(id);
  }
  addCourseResource(id, dto) {
    return this.coursesService.addCourseResource(id, dto);
  }
  removeCourseResource(id, resourceId) {
    return this.coursesService.removeCourseResource(id, resourceId);
  }
  getCourseTrainerStats(id) {
    return this.coursesService.getCourseTrainerStats(id);
  }
  assignInstructor(id, dto) {
    return this.coursesService.updateInstructor(id, dto.instructorId);
  }
  findOne(id) {
    return this.coursesService.findOne(id);
  }
};
exports.CoursesController = CoursesController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('hub')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'findAllRoot',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'createRoot',
  null,
);
__decorate(
  [
    (0, common_1.Get)('course'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('hub')),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)('course'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Get)('enrollment'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('contactId')),
    __param(1, (0, common_1.Query)('groupId')),
    __param(2, (0, common_1.Query)('courseId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String, String]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'getEnrollments',
  null,
);
__decorate(
  [
    (0, common_1.Post)('enrollment'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'enroll',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':id/enroll'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'enrollById',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':id/admin-enroll'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'adminEnroll',
  null,
);
__decorate(
  [
    (0, common_1.Get)('enrollment/pending'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'getPendingEnrollments',
  null,
);
__decorate(
  [
    (0, common_1.Patch)('enrollment/:id/approve'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'approveEnrollment',
  null,
);
__decorate(
  [
    (0, common_1.Patch)('enrollment/:id/reject'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'rejectEnrollment',
  null,
);
__decorate(
  [
    (0, common_1.Get)('combo'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'combo',
  null,
);
__decorate(
  [
    (0, common_1.Get)('coursescombo'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'coursesCombo',
  null,
);
__decorate(
  [
    (0, common_1.Get)('coursereports'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'courseReports',
  null,
);
__decorate(
  [
    (0, common_1.Get)('reportfrequency'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'reportFrequency',
  null,
);
__decorate(
  [
    (0, common_1.Get)('request'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'courseRequests',
  null,
);
__decorate(
  [
    (0, common_1.Get)('category'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'getCategories',
  null,
);
__decorate(
  [
    (0, common_1.Get)('instructors'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'getInstructors',
  null,
);
__decorate(
  [
    (0, common_1.Get)('content/:contentId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  CoursesController.prototype,
  'getContent',
  null,
);
__decorate(
  [
    (0, common_1.Post)('content/:contentId/complete'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  CoursesController.prototype,
  'markComplete',
  null,
);
__decorate(
  [
    (0, common_1.Get)('modules/:moduleId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('moduleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  CoursesController.prototype,
  'getModule',
  null,
);
__decorate(
  [
    (0, common_1.Patch)('modules/:moduleId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('moduleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'updateModule',
  null,
);
__decorate(
  [
    (0, common_1.Post)('modules/:moduleId/content'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('moduleId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'createContent',
  null,
);
__decorate(
  [
    (0, common_1.Patch)('content/:contentId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'updateContent',
  null,
);
__decorate(
  [
    (0, common_1.Delete)('content/:contentId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('contentId', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'deleteContent',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/modules'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  CoursesController.prototype,
  'getCourseModules',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/progress'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  CoursesController.prototype,
  'getCourseProgress',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':id/modules'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'createModule',
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
  CoursesController.prototype,
  'getCourseResources',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':id/resources'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'addCourseResource',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id/resources/:resourceId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('resourceId', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Number]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'removeCourseResource',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/trainer-stats'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'getCourseTrainerStats',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id/instructor'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'assignInstructor',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  CoursesController.prototype,
  'findOne',
  null,
);
exports.CoursesController = CoursesController = __decorate(
  [
    (0, swagger_1.ApiTags)('courses'),
    (0, common_1.Controller)('api/courses'),
    __metadata('design:paramtypes', [courses_service_1.CoursesService]),
  ],
  CoursesController,
);
//# sourceMappingURL=courses.controller.js.map
