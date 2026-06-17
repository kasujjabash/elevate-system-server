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
Object.defineProperty(exports, '__esModule', { value: true });
exports.StudentHubController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const students_service_1 = require('./students.service');
const swagger_1 = require('@nestjs/swagger');
let StudentHubController = class StudentHubController {
  constructor(studentsService) {
    this.studentsService = studentsService;
  }
  getByHub() {
    return this.studentsService.getStudentsByHub();
  }
  search() {
    return [];
  }
};
exports.StudentHubController = StudentHubController;
__decorate(
  [
    (0, common_1.Get)('hub'),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  StudentHubController.prototype,
  'getByHub',
  null,
);
__decorate(
  [
    (0, common_1.Get)('search'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  StudentHubController.prototype,
  'search',
  null,
);
exports.StudentHubController = StudentHubController = __decorate(
  [
    (0, swagger_1.ApiTags)('students'),
    (0, common_1.Controller)('api/student'),
    __metadata('design:paramtypes', [students_service_1.StudentsService]),
  ],
  StudentHubController,
);
//# sourceMappingURL=student-hub.controller.js.map
