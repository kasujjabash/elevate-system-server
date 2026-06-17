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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.JwtTenantHeaderMiddleware = void 0;
const common_1 = require('@nestjs/common');
const jwt_helpers_service_1 = require('../auth/jwt-helpers.service');
let JwtTenantHeaderMiddleware = class JwtTenantHeaderMiddleware {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }
  async use(req, res, next) {
    const jwtToken = req.headers.authorization.slice(7);
    const tokenPayload = await this.jwtService.decodeToken(jwtToken);
    const tenant =
      tokenPayload && tokenPayload.hasOwnProperty('aud')
        ? tokenPayload.aud
        : '';
    req.headers.tenant = tenant;
    common_1.Logger.log(`New request received from church: ${tenant}`);
    next();
  }
};
exports.JwtTenantHeaderMiddleware = JwtTenantHeaderMiddleware;
exports.JwtTenantHeaderMiddleware = JwtTenantHeaderMiddleware = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [jwt_helpers_service_1.JwtHelperService]),
  ],
  JwtTenantHeaderMiddleware,
);
//# sourceMappingURL=jwtTenantHeader.middleware.js.map
