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
exports.CreateCommunityReachDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');
const REACH_METHODS = ['Walk-in', 'Event', 'Referral', 'Social Media', 'Other'];
class CreateCommunityReachDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      fullName: { required: true, type: () => String },
      phone: { required: false, type: () => String },
      hubId: { required: true, type: () => Number, minimum: 1 },
      reachMethod: { required: true, type: () => String, enum: REACH_METHODS },
      eventId: { required: false, type: () => Number, minimum: 1 },
    };
  }
}
exports.CreateCommunityReachDto = CreateCommunityReachDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'Full name of the person reached',
    }),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  CreateCommunityReachDto.prototype,
  'fullName',
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
  CreateCommunityReachDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ description: 'Hub they were reached at/for' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata('design:type', Number),
  ],
  CreateCommunityReachDto.prototype,
  'hubId',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      description: 'How they were reached',
      enum: REACH_METHODS,
    }),
    (0, class_validator_1.IsIn)(REACH_METHODS),
    __metadata('design:type', String),
  ],
  CreateCommunityReachDto.prototype,
  'reachMethod',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description:
        'Calendar event they were reached at (when reachMethod = Event)',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.reachMethod === 'Event'),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata('design:type', Number),
  ],
  CreateCommunityReachDto.prototype,
  'eventId',
  void 0,
);
//# sourceMappingURL=create-community-reach.dto.js.map
