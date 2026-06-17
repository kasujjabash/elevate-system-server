'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class CreateRequestDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      firstName: { required: true, type: () => String },
      lastName: { required: true, type: () => String },
      email: { required: true, type: () => String },
      phone: { required: true, type: () => String },
      churchLocation: { required: true, type: () => Number },
      residencePlaceId: { required: true, type: () => String },
      residenceDescription: { required: true, type: () => String },
    };
  }
}
exports.default = CreateRequestDto;
//# sourceMappingURL=create-request.dto.js.map
