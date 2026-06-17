'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const common_1 = require('@nestjs/common');
class ClientFriendlyException extends common_1.HttpException {
  constructor(response, status = common_1.HttpStatus.BAD_REQUEST) {
    super(response, status);
  }
}
exports.default = ClientFriendlyException;
//# sourceMappingURL=client-friendly.exception.js.map
