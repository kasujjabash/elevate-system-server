'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UpdateChatDto = void 0;
const openapi = require('@nestjs/swagger');
const mapped_types_1 = require('@nestjs/mapped-types');
const sendMail_dto_1 = require('./sendMail.dto');
class UpdateChatDto extends (0, mapped_types_1.PartialType)(
  sendMail_dto_1.default,
) {
  static _OPENAPI_METADATA_FACTORY() {
    return {};
  }
}
exports.UpdateChatDto = UpdateChatDto;
//# sourceMappingURL=update-chat.dto.js.map
