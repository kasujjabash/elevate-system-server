'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class GooglePlaceDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      vicinity: { required: true, type: () => String },
      name: { required: true, type: () => String },
      district: { required: true, type: () => String },
      country: { required: true, type: () => String },
      placeId: { required: true, type: () => String },
      latitude: { required: true, type: () => Number },
      longitude: { required: true, type: () => Number },
    };
  }
}
exports.default = GooglePlaceDto;
//# sourceMappingURL=google-place.dto.js.map
