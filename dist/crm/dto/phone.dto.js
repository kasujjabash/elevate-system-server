'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PhoneDto = void 0;
const openapi = require('@nestjs/swagger');
class PhoneDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      category: {
        required: true,
        enum: require('../enums/phoneCategory').PhoneCategory,
      },
      value: { required: true, type: () => String },
      isPrimary: { required: true, type: () => Boolean },
      contactId: { required: true, type: () => Number },
    };
  }
}
exports.PhoneDto = PhoneDto;
//# sourceMappingURL=phone.dto.js.map
