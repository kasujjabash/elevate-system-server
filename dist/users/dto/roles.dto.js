'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.RolesDto = void 0;
const openapi = require('@nestjs/swagger');
class RolesDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      role: { required: true, type: () => String },
      description: { required: true, type: () => String },
      permissions: { required: true, type: () => [String] },
      isActive: { required: true, type: () => Boolean },
    };
  }
}
exports.RolesDto = RolesDto;
//# sourceMappingURL=roles.dto.js.map
