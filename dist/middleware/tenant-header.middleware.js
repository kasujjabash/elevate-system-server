'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TenantHeaderMiddleware = void 0;
const common_1 = require('@nestjs/common');
const stringHelpers_1 = require('../utils/stringHelpers');
let TenantHeaderMiddleware = class TenantHeaderMiddleware {
  use(req, res, next) {
    const hubName = req.body.hasOwnProperty('hubName')
      ? req.body['hubName']
      : req.query['hubName'];
    const tenant = (0, stringHelpers_1.lowerCaseRemoveSpaces)(hubName);
    req.headers.tenant = tenant;
    common_1.Logger.log(`New request received from hub: ${tenant}`);
    next();
  }
};
exports.TenantHeaderMiddleware = TenantHeaderMiddleware;
exports.TenantHeaderMiddleware = TenantHeaderMiddleware = __decorate(
  [(0, common_1.Injectable)()],
  TenantHeaderMiddleware,
);
//# sourceMappingURL=tenant-header.middleware.js.map
