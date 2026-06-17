'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UssdResponseDto = exports.ChatAction = void 0;
const openapi = require('@nestjs/swagger');
var ChatAction;
(function (ChatAction) {
  ChatAction[(ChatAction['Prompt'] = 0)] = 'Prompt';
  ChatAction[(ChatAction['End'] = 1)] = 'End';
})(ChatAction || (exports.ChatAction = ChatAction = {}));
class UssdResponseDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      action: {
        required: true,
        enum: require('./ussd-response.dto').ChatAction,
      },
      text: { required: true, type: () => String },
    };
  }
}
exports.UssdResponseDto = UssdResponseDto;
//# sourceMappingURL=ussd-response.dto.js.map
