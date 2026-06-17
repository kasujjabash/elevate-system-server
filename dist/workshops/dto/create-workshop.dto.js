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
exports.CreateWorkshopDto = exports.WorkshopType = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');
var WorkshopType;
(function (WorkshopType) {
  WorkshopType['Workshop'] = 'Workshop';
  WorkshopType['Podcast'] = 'Podcast';
})(WorkshopType || (exports.WorkshopType = WorkshopType = {}));
class CreateWorkshopDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      title: { required: true, type: () => String },
      description: { required: false, type: () => String },
      type: {
        required: false,
        enum: require('./create-workshop.dto').WorkshopType,
      },
      url: { required: false, type: () => String },
      courseId: { required: false, type: () => Number },
      hubId: { required: false, type: () => Number },
    };
  }
}
exports.CreateWorkshopDto = CreateWorkshopDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Workshop title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  CreateWorkshopDto.prototype,
  'title',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Workshop description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateWorkshopDto.prototype,
  'description',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Workshop type - Workshop or Podcast',
      enum: WorkshopType,
      default: WorkshopType.Workshop,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateWorkshopDto.prototype,
  'type',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Workshop URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateWorkshopDto.prototype,
  'url',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Course ID' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateWorkshopDto.prototype,
  'courseId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hub ID' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateWorkshopDto.prototype,
  'hubId',
  void 0,
);
//# sourceMappingURL=create-workshop.dto.js.map
