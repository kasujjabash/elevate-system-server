'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class PersonListDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      name: { required: true, type: () => String },
      avatar: { required: true, type: () => String },
    };
  }
}
exports.default = PersonListDto;
//# sourceMappingURL=person-list.dto.js.map
