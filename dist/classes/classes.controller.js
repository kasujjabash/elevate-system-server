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
exports.ClassesController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const classes_service_1 = require('./classes.service');
const swagger_1 = require('@nestjs/swagger');
let ClassesController = class ClassesController {
  constructor(classesService) {
    this.classesService = classesService;
  }
  findAll(from, to, hubId, courseId, limit, skip) {
    return this.classesService.findAll({
      from,
      to,
      hubId,
      courseId,
      limit: parseInt(limit || '100', 10),
      skip: parseInt(skip || '0', 10),
    });
  }
  create(body) {
    return this.classesService.create(body);
  }
  getMember(contactId) {
    return [];
  }
  getAttendance(classId) {
    return [];
  }
  markAttendance(body) {
    return { marked: body.studentIds?.length || 0 };
  }
  getRegistrations(classId, contactId) {
    return [];
  }
  register(body) {
    return { message: 'Registered' };
  }
  getCategories() {
    return [];
  }
  getFields() {
    return [];
  }
  getActivities() {
    return [];
  }
  getMetricsRaw(from, to) {
    return this.classesService.getMetricsRaw(from, to);
  }
  getDaysOff() {
    return [];
  }
};
exports.ClassesController = ClassesController;
__decorate(
  [
    (0, common_1.Get)('class'),
    (0, swagger_1.ApiOperation)({ summary: 'List classes/sessions' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('hubId')),
    __param(3, (0, common_1.Query)('courseId')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('skip')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      String,
      String,
      String,
      String,
      String,
      String,
    ]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)('class'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a class session' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Get)('member'),
    (0, swagger_1.ApiOperation)({ summary: 'Get classes a student attended' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('contactId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getMember',
  null,
);
__decorate(
  [
    (0, common_1.Get)('attendance'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('classId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getAttendance',
  null,
);
__decorate(
  [
    (0, common_1.Post)('attendance'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'markAttendance',
  null,
);
__decorate(
  [
    (0, common_1.Get)('registration'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('classId')),
    __param(1, (0, common_1.Query)('contactId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getRegistrations',
  null,
);
__decorate(
  [
    (0, common_1.Post)('registration'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'register',
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
  ClassesController.prototype,
  'getCategories',
  null,
);
__decorate(
  [
    (0, common_1.Get)('fields'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getFields',
  null,
);
__decorate(
  [
    (0, common_1.Get)('activities'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getActivities',
  null,
);
__decorate(
  [
    (0, common_1.Get)('metrics/raw'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, String]),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getMetricsRaw',
  null,
);
__decorate(
  [
    (0, common_1.Get)('dayoff'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  ClassesController.prototype,
  'getDaysOff',
  null,
);
exports.ClassesController = ClassesController = __decorate(
  [
    (0, swagger_1.ApiTags)('classes'),
    (0, common_1.Controller)('api/classes'),
    __metadata('design:paramtypes', [classes_service_1.ClassesService]),
  ],
  ClassesController,
);
//# sourceMappingURL=classes.controller.js.map
