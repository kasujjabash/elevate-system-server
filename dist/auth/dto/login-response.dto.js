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
exports.RefreshTokenResponseDto =
  exports.LoginResponseDto =
  exports.HierarchyDto =
  exports.GroupHierarchyDto =
    void 0;
const openapi = require('@nestjs/swagger');
const swagger_1 = require('@nestjs/swagger');
class GroupHierarchyDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      name: { required: true, type: () => String },
      type: { required: true, type: () => String },
      memberCount: { required: true, type: () => Number },
    };
  }
}
exports.GroupHierarchyDto = GroupHierarchyDto;
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Number)],
  GroupHierarchyDto.prototype,
  'id',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  GroupHierarchyDto.prototype,
  'name',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  GroupHierarchyDto.prototype,
  'type',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Number)],
  GroupHierarchyDto.prototype,
  'memberCount',
  void 0,
);
class HierarchyDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      myGroups: {
        required: true,
        type: () => [require('./login-response.dto').GroupHierarchyDto],
      },
      canManageGroupIds: { required: false, type: () => [Number] },
      canViewGroupIds: { required: false, type: () => [Number] },
    };
  }
}
exports.HierarchyDto = HierarchyDto;
__decorate(
  [
    (0, swagger_1.ApiProperty)({ type: [GroupHierarchyDto] }),
    __metadata('design:type', Array),
  ],
  HierarchyDto.prototype,
  'myGroups',
  void 0,
);
class LoginResponseDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      token: { required: true, type: () => String },
      user: { required: true, type: () => Object },
      hierarchy: {
        required: false,
        type: () => require('./login-response.dto').HierarchyDto,
      },
    };
  }
}
exports.LoginResponseDto = LoginResponseDto;
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  LoginResponseDto.prototype,
  'token',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', Object)],
  LoginResponseDto.prototype,
  'user',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', HierarchyDto)],
  LoginResponseDto.prototype,
  'hierarchy',
  void 0,
);
class RefreshTokenResponseDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      token: { required: true, type: () => String },
      refreshToken: { required: true, type: () => String },
    };
  }
}
exports.RefreshTokenResponseDto = RefreshTokenResponseDto;
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  RefreshTokenResponseDto.prototype,
  'token',
  void 0,
);
__decorate(
  [(0, swagger_1.ApiProperty)(), __metadata('design:type', String)],
  RefreshTokenResponseDto.prototype,
  'refreshToken',
  void 0,
);
//# sourceMappingURL=login-response.dto.js.map
