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
exports.UpdateUserDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
class UpdateUserDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      roles: { required: false, type: () => [String] },
      oldPassword: { required: false, type: () => String },
      password: { required: false, type: () => String },
      isActive: { required: false, type: () => Boolean },
      contactId: { required: false, type: () => Number },
      hubId: { required: false, type: () => Number },
      courseIds: { required: false, type: () => [Number] },
      phone: { required: false, type: () => String },
      dateOfBirth: { required: false, type: () => String },
      firstName: { required: false, type: () => String },
      lastName: { required: false, type: () => String },
    };
  }
}
exports.UpdateUserDto = UpdateUserDto;
__decorate(
  [
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata('design:type', Number),
  ],
  UpdateUserDto.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata('design:type', Array),
  ],
  UpdateUserDto.prototype,
  'roles',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata('design:type', Number),
  ],
  UpdateUserDto.prototype,
  'contactId',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata('design:type', Number),
  ],
  UpdateUserDto.prototype,
  'hubId',
  void 0,
);
__decorate(
  [
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata('design:type', Array),
  ],
  UpdateUserDto.prototype,
  'courseIds',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsOptional)(), __metadata('design:type', String)],
  UpdateUserDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsOptional)(), __metadata('design:type', String)],
  UpdateUserDto.prototype,
  'dateOfBirth',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsOptional)(), __metadata('design:type', String)],
  UpdateUserDto.prototype,
  'firstName',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsOptional)(), __metadata('design:type', String)],
  UpdateUserDto.prototype,
  'lastName',
  void 0,
);
//# sourceMappingURL=update-user.dto.js.map
