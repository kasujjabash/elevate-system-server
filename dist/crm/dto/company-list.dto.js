'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class CompanyListDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      name: { required: true, type: () => String },
    };
  }
}
exports.default = CompanyListDto;
//# sourceMappingURL=company-list.dto.js.map
