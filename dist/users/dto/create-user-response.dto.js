'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CreateUserResponseDto = void 0;
const openapi = require('@nestjs/swagger');
class CreateUserResponseDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      token: { required: true, type: () => String },
      mailURL: { required: true, type: () => String },
      user: { required: true, type: () => require('./user.dto').UserListDto },
    };
  }
}
exports.CreateUserResponseDto = CreateUserResponseDto;
//# sourceMappingURL=create-user-response.dto.js.map
