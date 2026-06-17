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
exports.TimetableController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const timetable_service_1 = require('./timetable.service');
let TimetableController = class TimetableController {
  constructor(timetableService) {
    this.timetableService = timetableService;
  }
  getMyTimetable(req) {
    return this.timetableService.findForJwtUser(req.user);
  }
  getTimetable(req, studentId, contactId, hubId, courseId) {
    const sid = studentId || contactId;
    if (sid) return this.timetableService.findForStudent(sid);
    return this.timetableService.findAllScoped({ hubId, courseId }, req?.user);
  }
  create(dto) {
    return this.timetableService.create(dto);
  }
  update(id, dto) {
    return this.timetableService.update(id, dto);
  }
  remove(id) {
    return this.timetableService.remove(id);
  }
};
exports.TimetableController = TimetableController;
__decorate(
  [
    (0, common_1.Get)('mine'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  TimetableController.prototype,
  'getMyTimetable',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('contactId')),
    __param(3, (0, common_1.Query)('hubId')),
    __param(4, (0, common_1.Query)('courseId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, String, String, String, String]),
    __metadata('design:returntype', void 0),
  ],
  TimetableController.prototype,
  'getTimetable',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  TimetableController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  TimetableController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', void 0),
  ],
  TimetableController.prototype,
  'remove',
  null,
);
exports.TimetableController = TimetableController = __decorate(
  [
    (0, swagger_1.ApiTags)('timetable'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/timetable'),
    __metadata('design:paramtypes', [timetable_service_1.TimetableService]),
  ],
  TimetableController,
);
//# sourceMappingURL=timetable.controller.js.map
