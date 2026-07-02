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
exports.AssignmentsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const platform_express_1 = require('@nestjs/platform-express');
const multer_1 = require('multer');
const path_1 = require('path');
const assignments_service_1 = require('./assignments.service');
const swagger_1 = require('@nestjs/swagger');
const jwt_auth_guard_1 = require('../auth/guards/jwt-auth.guard');
let AssignmentsController = class AssignmentsController {
  constructor(assignmentsService) {
    this.assignmentsService = assignmentsService;
  }
  create(dto) {
    return this.assignmentsService.create(dto);
  }
  async findAll(req, contactId, courseId) {
    if (contactId)
      return this.assignmentsService.findByContact(parseInt(contactId, 10));
    const roles = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');
    if (!isAdmin) {
      const trainerContactId = req.user.contactId ?? req.user.id ?? null;
      return this.assignmentsService.findAllForTrainer(
        trainerContactId,
        courseId ? parseInt(courseId, 10) : undefined,
      );
    }
    return this.assignmentsService.findAll(
      courseId ? { courseId: parseInt(courseId, 10) } : undefined,
    );
  }
  getMyAssignments(req) {
    return this.assignmentsService.findByContact(req.user.contactId);
  }
  async getSubmissions(id, req) {
    const roles = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');
    if (!isAdmin) {
      const trainerContactId = req.user.contactId ?? req.user.id ?? null;
      const owns = await this.assignmentsService.trainerOwnsAssignment(
        trainerContactId,
        id,
      );
      if (!owns) return [];
    }
    return this.assignmentsService.getSubmissions(id);
  }
  submit(id, body, req) {
    return this.assignmentsService.submitAssignment(
      id,
      req.user.contactId,
      body,
    );
  }
  submitFile(id, file, req) {
    if (!file) throw new common_1.HttpException('No file uploaded', 400);
    return this.assignmentsService.submitAssignment(id, req.user.contactId, {
      type: 'file',
      fileName: file.originalname,
      filePath: `/uploads/assignments/${file.filename}`,
    });
  }
  grade(submissionId, dto) {
    return this.assignmentsService.gradeSubmission(submissionId, dto);
  }
  getAllSubmissions(req, status, limit, courseId, instructorId) {
    const roles = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');
    const effectiveInstructorContactId = isAdmin
      ? instructorId
        ? parseInt(instructorId, 10)
        : undefined
      : req.user.contactId ?? req.user.id ?? undefined;
    return this.assignmentsService.getAllSubmissions({
      status,
      limit: limit ? parseInt(limit, 10) : 50,
      courseId,
      instructorContactId: effectiveInstructorContactId,
    });
  }
  getFiles() {
    return [];
  }
  getGrades() {
    return [];
  }
  gradeByBody(dto) {
    return this.assignmentsService.gradeByBody(dto);
  }
  likeSubmission(id) {
    return this.assignmentsService.likeSubmission(id);
  }
  approveSubmission(id) {
    return this.assignmentsService.approveSubmission(id);
  }
  async updateAssignment(id, dto, req) {
    const roles = Array.isArray(req?.user?.roles)
      ? req.user.roles
      : (req?.user?.roles || '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isAdmin =
      roles.includes('ADMIN') ||
      roles.includes('SUPER_ADMIN') ||
      roles.includes('HUB_MANAGER');
    const trainerContactId = req.user.contactId ?? req.user.id ?? null;
    return this.assignmentsService.update(id, dto, trainerContactId, isAdmin);
  }
  findOne(id) {
    return this.assignmentsService.findOne(id);
  }
};
exports.AssignmentsController = AssignmentsController;
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('contactId')),
    __param(2, (0, common_1.Query)('courseId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String]),
    __metadata('design:returntype', Promise),
  ],
  AssignmentsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)('mine'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'getMyAssignments',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id/submissions'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  AssignmentsController.prototype,
  'getSubmissions',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':id/submissions'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'submit',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':id/submissions/file'),
    (0, common_1.UseInterceptors)(
      (0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
          destination: './uploads/assignments',
          filename: (_req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
          },
        }),
        limits: { fileSize: 20 * 1024 * 1024 },
      }),
    ),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'submitFile',
  null,
);
__decorate(
  [
    (0, common_1.Patch)('submissions/:submissionId/grade'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('submissionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'grade',
  null,
);
__decorate(
  [
    (0, common_1.Get)('submissions'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('courseId')),
    __param(4, (0, common_1.Query)('instructorId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String, String, String]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'getAllSubmissions',
  null,
);
__decorate(
  [
    (0, common_1.Get)('files'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'getFiles',
  null,
);
__decorate(
  [
    (0, common_1.Get)('grades'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'getGrades',
  null,
);
__decorate(
  [
    (0, common_1.Post)('grades'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'gradeByBody',
  null,
);
__decorate(
  [
    (0, common_1.Post)('submissions/:id/like'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'likeSubmission',
  null,
);
__decorate(
  [
    (0, common_1.Post)('submissions/:id/approve'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'approveSubmission',
  null,
);
__decorate(
  [
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object, Object]),
    __metadata('design:returntype', Promise),
  ],
  AssignmentsController.prototype,
  'updateAssignment',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  AssignmentsController.prototype,
  'findOne',
  null,
);
exports.AssignmentsController = AssignmentsController = __decorate(
  [
    (0, swagger_1.ApiTags)('assignments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/assignments'),
    __metadata('design:paramtypes', [assignments_service_1.AssignmentsService]),
  ],
  AssignmentsController,
);
//# sourceMappingURL=assignments.controller.js.map
