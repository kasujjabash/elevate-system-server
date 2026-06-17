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
exports.UserDto = void 0;
const openapi = require('@nestjs/swagger');
const swagger_1 = require('@nestjs/swagger');
const user_dto_1 = require('../../users/dto/user.dto');
class UserDto extends user_dto_1.UserPermissions {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      contactId: { required: true, type: () => Number },
      username: { required: true, type: () => String },
      email: { required: true, type: () => String },
      fullName: { required: true, type: () => String },
      roles: { required: true, type: () => [String] },
      isActive: { required: true, type: () => Boolean },
      permissions: { required: false, type: () => [String] },
    };
  }
}
exports.UserDto = UserDto;
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Number)],
  UserDto.prototype,
  'id',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Number)],
  UserDto.prototype,
  'contactId',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  UserDto.prototype,
  'username',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  UserDto.prototype,
  'email',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  UserDto.prototype,
  'fullName',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Array)],
  UserDto.prototype,
  'roles',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Boolean)],
  UserDto.prototype,
  'isActive',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Array)],
  UserDto.prototype,
  'permissions',
  void 0,
);
//# sourceMappingURL=user.dto.js.map
