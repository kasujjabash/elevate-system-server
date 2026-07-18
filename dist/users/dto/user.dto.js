'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserDto = exports.UserListDto = exports.UserPermissions = void 0;
const openapi = require('@nestjs/swagger');
class UserPermissions {
  static _OPENAPI_METADATA_FACTORY() {
    return { permissions: { required: false, type: () => [String] } };
  }
}
exports.UserPermissions = UserPermissions;
class UserListDto extends UserPermissions {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      username: { required: true, type: () => String },
      fullName: { required: true, type: () => String },
      contactId: { required: true, type: () => Number },
      contact: { required: true, type: () => Object },
      avatar: { required: true, type: () => String },
      roles: { required: true, type: () => [String] },
      isActive: { required: true, type: () => Boolean },
      hubId: { required: false, type: () => Number, nullable: true },
      hubName: { required: false, type: () => String, nullable: true },
      courseIds: { required: false, type: () => [Number] },
      courses: { required: false, type: () => [Object] },
      firstName: { required: false, type: () => String },
      lastName: { required: false, type: () => String },
      dateOfBirth: { required: false, type: () => Object },
      phone: { required: false, type: () => String },
      gender: { required: false, type: () => String },
    };
  }
}
exports.UserListDto = UserListDto;
class UserDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      username: { required: true, type: () => String },
      isActive: { required: true, type: () => Boolean },
    };
  }
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map
