'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.OptionDto = exports.ReportFieldDto = void 0;
const openapi = require('@nestjs/swagger');
class ReportFieldDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      name: { required: true, type: () => String },
      type: {
        required: true,
        enum: require('../enums/report.enum').ReportFieldType,
      },
      label: { required: true, type: () => String },
      required: { required: true, type: () => Boolean },
      options: {
        required: false,
        type: () => [require('./report.dto').OptionDto],
      },
    };
  }
}
exports.ReportFieldDto = ReportFieldDto;
class OptionDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      label: { required: true, type: () => String },
      value: { required: true, type: () => String },
    };
  }
}
exports.OptionDto = OptionDto;
//# sourceMappingURL=report.dto.js.map
