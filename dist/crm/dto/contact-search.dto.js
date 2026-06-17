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
exports.ContactSearchDto = void 0;
const openapi = require('@nestjs/swagger');
const search_dto_1 = require('../../shared/dto/search.dto');
const class_validator_1 = require('class-validator');
const class_transformer_1 = require('class-transformer');
class ContactSearchDto extends search_dto_1.default {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      email: { required: false, type: () => String },
      phone: { required: false, type: () => String },
      skipUsers: { required: false, type: () => Boolean },
      cellGroups: { required: false, type: () => [Number] },
      ageGroups: { required: false, type: () => [Number] },
      churchLocations: { required: false, type: () => [Number] },
    };
  }
}
exports.ContactSearchDto = ContactSearchDto;
__decorate(
  [
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata('design:type', Array),
  ],
  ContactSearchDto.prototype,
  'cellGroups',
  void 0,
);
__decorate(
  [
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata('design:type', Array),
  ],
  ContactSearchDto.prototype,
  'ageGroups',
  void 0,
);
__decorate(
  [
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata('design:type', Array),
  ],
  ContactSearchDto.prototype,
  'churchLocations',
  void 0,
);
//# sourceMappingURL=contact-search.dto.js.map
