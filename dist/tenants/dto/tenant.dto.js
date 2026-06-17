'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TenantDto = void 0;
const openapi = require('@nestjs/swagger');
class TenantDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      name: { required: true, type: () => String },
      seed: { required: false, type: () => Boolean },
    };
  }
}
exports.TenantDto = TenantDto;
//# sourceMappingURL=tenant.dto.js.map
