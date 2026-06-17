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
exports.CreatePersonDto = void 0;
const openapi = require('@nestjs/swagger');
const civilStatus_1 = require('../enums/civilStatus');
const gender_1 = require('../enums/gender');
const class_validator_1 = require('class-validator');
class CreatePersonDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      email: { required: true, type: () => String },
      phone: { required: true, type: () => String },
      firstName: { required: true, type: () => String },
      lastName: { required: true, type: () => String },
      middleName: { required: false, type: () => String },
      gender: { required: true, enum: require('../enums/gender').Gender },
      civilStatus: {
        required: false,
        enum: require('../enums/civilStatus').CivilStatus,
      },
      dateOfBirth: { required: true, type: () => Object },
      ageGroup: { required: false, type: () => String },
      placeOfWork: { required: false, type: () => String },
      residence: { required: false, type: () => Object },
      cellGroupId: { required: false, type: () => Object },
      churchLocationId: { required: false, type: () => Number },
      inCell: { required: false, type: () => Object },
      joinCell: { required: false, type: () => Object },
    };
  }
}
exports.CreatePersonDto = CreatePersonDto;
__decorate(
  [
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata('design:type', String),
  ],
  CreatePersonDto.prototype,
  'email',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  CreatePersonDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  CreatePersonDto.prototype,
  'firstName',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  CreatePersonDto.prototype,
  'lastName',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsEnum)(gender_1.Gender),
    __metadata('design:type', String),
  ],
  CreatePersonDto.prototype,
  'gender',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsEnum)(civilStatus_1.CivilStatus),
    __metadata('design:type', String),
  ],
  CreatePersonDto.prototype,
  'civilStatus',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsDateString)(), __metadata('design:type', Object)],
  CreatePersonDto.prototype,
  'dateOfBirth',
  void 0,
);
//# sourceMappingURL=create-person.dto.js.map
