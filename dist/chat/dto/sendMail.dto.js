'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
class mailChatDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      subject: { required: true, type: () => String },
      body: { required: true, type: () => String },
      recipientId: { required: true, type: () => [Number] },
    };
  }
}
exports.default = mailChatDto;
//# sourceMappingURL=sendMail.dto.js.map
