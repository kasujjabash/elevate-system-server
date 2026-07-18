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
exports.CreateJobPlacementDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');
const PLACEMENT_TYPES = ['Employed', 'SelfEmployed', 'Freelance', 'Internship'];
class CreateJobPlacementDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      fullName: { required: true, type: () => String },
      gender: { required: false, type: () => String },
      phone: { required: false, type: () => String },
      courseId: { required: true, type: () => Number, minimum: 1 },
      hubId: { required: true, type: () => Number, minimum: 1 },
      yearCompleted: { required: false, type: () => Number, minimum: 1900 },
      placementType: {
        required: true,
        type: () => String,
        enum: PLACEMENT_TYPES,
      },
      jobTitle: { required: false, type: () => String },
      salaryBeforeProgram: { required: false, type: () => Number },
      salaryAfterProgram: { required: false, type: () => Number },
      companyName: { required: false, type: () => String },
      industry: {
        required: false,
        type: () => String,
        enum: ['Tech', 'Design', 'Media', 'Other'],
      },
      employmentType: {
        required: false,
        type: () => String,
        enum: ['FullTime', 'PartTime', 'Freelance', 'Internship'],
      },
      referredBy: { required: false, type: () => String },
      internshipOrganization: { required: false, type: () => String },
      internshipRole: { required: false, type: () => String },
      internshipSupervisor: { required: false, type: () => String },
      isPaidInternship: { required: false, type: () => Boolean },
      internshipStipend: { required: false, type: () => Number, minimum: 0 },
    };
  }
}
exports.CreateJobPlacementDto = CreateJobPlacementDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Full name of the placed person',
    }),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'fullName',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gender' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'gender',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Phone / WhatsApp number',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Course they took' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata('design:type', Number),
  ],
  CreateJobPlacementDto.prototype,
  'courseId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Hub they trained at' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata('design:type', Number),
  ],
  CreateJobPlacementDto.prototype,
  'hubId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Year the course was completed',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateJobPlacementDto.prototype,
  'yearCompleted',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Placement outcome',
      enum: PLACEMENT_TYPES,
    }),
    (0, class_validator_1.IsIn)(PLACEMENT_TYPES),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'placementType',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Job title / what they do',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType !== 'Internship'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'jobTitle',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Monthly salary before the program',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType !== 'Internship'),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateJobPlacementDto.prototype,
  'salaryBeforeProgram',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Monthly salary after the program',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType !== 'Internship'),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateJobPlacementDto.prototype,
  'salaryAfterProgram',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Company name' }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Employed'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'companyName',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Industry',
      enum: ['Tech', 'Design', 'Media', 'Other'],
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Employed'),
    (0, class_validator_1.IsIn)(['Tech', 'Design', 'Media', 'Other']),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'industry',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Employment type',
      enum: ['FullTime', 'PartTime', 'Freelance', 'Internship'],
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Employed'),
    (0, class_validator_1.IsIn)([
      'FullTime',
      'PartTime',
      'Freelance',
      'Internship',
    ]),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'employmentType',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Who referred/recruited them',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Employed'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'referredBy',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Organization they are interning at',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Internship'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'internshipOrganization',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Role / what they do' }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Internship'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'internshipRole',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Supervisor / who they work for',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Internship'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateJobPlacementDto.prototype,
  'internshipSupervisor',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Whether the internship pays a monthly stipend',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.placementType === 'Internship'),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Boolean),
  ],
  CreateJobPlacementDto.prototype,
  'isPaidInternship',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description:
        'Monthly stipend amount — required when isPaidInternship is true',
    }),
    (0, class_validator_1.ValidateIf)(
      (o) => o.placementType === 'Internship' && o.isPaidInternship === true,
    ),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata('design:type', Number),
  ],
  CreateJobPlacementDto.prototype,
  'internshipStipend',
  void 0,
);
//# sourceMappingURL=create-job-placement.dto.js.map
