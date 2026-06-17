'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateDto = void 0;
const openapi = require('@nestjs/swagger');
class UpdateDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      name: { required: false, type: () => String },
      type: {
        required: false,
        enum: require('../enums/report.enum').ReportType,
      },
      fields: { required: false, type: () => [String] },
      headers: { required: false, type: () => [String] },
      footer: { required: false, type: () => String },
    };
  }
}
exports.UpdateDto = UpdateDto;
//# sourceMappingURL=update.dto.js.map
