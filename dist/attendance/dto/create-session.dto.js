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
exports.CreateSessionDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');
class CreateSessionDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      label: { required: false, type: () => String },
      courseId: { required: false, type: () => Number, minimum: 1 },
      eventId: { required: false, type: () => Number, minimum: 1 },
      hubId: { required: true, type: () => Number, minimum: 1 },
      durationMinutes: { required: false, type: () => Number, minimum: 1 },
    };
  }
}
exports.CreateSessionDto = CreateSessionDto;
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Optional label (e.g. "Week 4 - Monday Class")',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateSessionDto.prototype,
  'label',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Course ID to associate with session',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateSessionDto.prototype,
  'courseId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Event ID to associate with session',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateSessionDto.prototype,
  'eventId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Hub ID — required for every attendance session',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata('design:type', Number),
  ],
  CreateSessionDto.prototype,
  'hubId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Minutes until token expires (default: 30)',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateSessionDto.prototype,
  'durationMinutes',
  void 0,
);
//# sourceMappingURL=create-session.dto.js.map
