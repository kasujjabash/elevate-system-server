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
exports.PersonEditDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
const gender_1 = require('../enums/gender');
const civilStatus_1 = require('../enums/civilStatus');
const salutation_1 = require('../enums/salutation');
class PersonEditDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      firstName: { required: true, type: () => String },
      lastName: { required: true, type: () => String },
      middleName: { required: false, type: () => String },
      gender: { required: false, enum: require('../enums/gender').Gender },
      civilStatus: {
        required: false,
        enum: require('../enums/civilStatus').CivilStatus,
      },
      dateOfBirth: { required: false, type: () => Date },
      residence: { required: false, type: () => String },
      placeOfWork: { required: false, type: () => String },
      contactId: { required: false, type: () => Number },
      salutation: {
        required: false,
        enum: require('../enums/salutation').Salutation,
      },
      age: { required: false, type: () => String },
      avatar: { required: false, type: () => String },
    };
  }
}
exports.PersonEditDto = PersonEditDto;
__decorate(
  [(0, class_validator_1.IsNumber)(), __metadata('design:type', Number)],
  PersonEditDto.prototype,
  'id',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  PersonEditDto.prototype,
  'firstName',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  PersonEditDto.prototype,
  'lastName',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gender_1.Gender),
    __metadata('design:type', String),
  ],
  PersonEditDto.prototype,
  'gender',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(civilStatus_1.CivilStatus),
    __metadata('design:type', String),
  ],
  PersonEditDto.prototype,
  'civilStatus',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata('design:type', Date),
  ],
  PersonEditDto.prototype,
  'dateOfBirth',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata('design:type', Number),
  ],
  PersonEditDto.prototype,
  'contactId',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(salutation_1.Salutation),
    __metadata('design:type', String),
  ],
  PersonEditDto.prototype,
  'salutation',
  void 0,
);
//# sourceMappingURL=person-edit.dto.js.map
