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
exports.CreateHubDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');
class CreateHubDto {
  constructor() {
    this.isActive = true;
  }
  static _OPENAPI_METADATA_FACTORY() {
    return {
      name: { required: true, type: () => String },
      code: { required: true, type: () => String },
      description: { required: false, type: () => String },
      location: { required: true, type: () => String },
      address: { required: false, type: () => String },
      isActive: { required: false, type: () => Boolean, default: true },
      managerName: { required: false, type: () => String },
      managerPhone: { required: false, type: () => String },
      managerEmail: { required: false, type: () => String },
      computers: { required: false, type: () => Number, minimum: 0 },
      projectors: { required: false, type: () => Number, minimum: 0 },
      capacity: { required: false, type: () => Number, minimum: 0 },
      notes: { required: false, type: () => String },
    };
  }
}
exports.CreateHubDto = CreateHubDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Hub name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Hub code (unique identifier)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'code',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hub description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'description',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Hub location' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'location',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hub address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'address',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Whether the hub is active',
      default: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Boolean),
  ],
  CreateHubDto.prototype,
  'isActive',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Hub manager full name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'managerName',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Hub manager phone number',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'managerPhone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Hub manager email' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'managerEmail',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of computers' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateHubDto.prototype,
  'computers',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of projectors' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateHubDto.prototype,
  'projectors',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Maximum seating capacity',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateHubDto.prototype,
  'capacity',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', String),
  ],
  CreateHubDto.prototype,
  'notes',
  void 0,
);
//# sourceMappingURL=create-hub.dto.js.map
