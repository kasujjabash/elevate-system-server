'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class ComboDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Object },
      name: { required: true, type: () => String },
    };
  }
}
exports.default = ComboDto;
//# sourceMappingURL=combo.dto.js.map
