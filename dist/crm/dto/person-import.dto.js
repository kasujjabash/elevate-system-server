'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class PersonImportDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      firstName: { required: true, type: () => String },
      lastName: { required: true, type: () => String },
      middleName: { required: false, type: () => String },
      gender: { required: false, type: () => String },
      phone: { required: true, type: () => String },
      email: { required: false, type: () => String },
      dateOfBirth: { required: false, type: () => String },
    };
  }
}
exports.default = PersonImportDto;
//# sourceMappingURL=person-import.dto.js.map
