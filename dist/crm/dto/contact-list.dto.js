'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class ContactListDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      name: { required: true, type: () => String },
      avatar: { required: true, type: () => String },
      ageGroup: { required: true, type: () => String },
      dateOfBirth: { required: true, type: () => Object },
      email: { required: true, type: () => String },
      phone: { required: true, type: () => String },
      cellGroup: {
        required: true,
        type: () => require('../../shared/dto/combo.dto').default,
      },
      location: {
        required: true,
        type: () => require('../../shared/dto/combo.dto').default,
      },
    };
  }
}
exports.default = ContactListDto;
//# sourceMappingURL=contact-list.dto.js.map
