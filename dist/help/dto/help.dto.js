'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class HelpDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      category: {
        required: true,
        enum: require('../enums/URLCategory').URLCategory,
      },
      title: { required: true, type: () => String },
      url: { required: false, type: () => String },
      createdOn: { required: true, type: () => Date },
      modifiedOn: { required: true, type: () => Date },
    };
  }
}
exports.default = HelpDto;
//# sourceMappingURL=help.dto.js.map
