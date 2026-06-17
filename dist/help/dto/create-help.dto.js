'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CreateHelpDto = void 0;
const openapi = require('@nestjs/swagger');
class CreateHelpDto {
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
exports.CreateHelpDto = CreateHelpDto;
//# sourceMappingURL=create-help.dto.js.map
