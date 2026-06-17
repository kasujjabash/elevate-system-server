'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PeopleUploadResponseDto = void 0;
const openapi = require('@nestjs/swagger');
class PeopleUploadResponseDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      status: { required: true, type: () => Boolean },
      message: { required: true, type: () => String },
      totalUploaded: { required: true, type: () => String },
    };
  }
}
exports.PeopleUploadResponseDto = PeopleUploadResponseDto;
//# sourceMappingURL=people-upload-response.dto.js.map
