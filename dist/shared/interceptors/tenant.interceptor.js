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
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.TenantInterceptor = void 0;
const common_1 = require('@nestjs/common');
const core_1 = require('@nestjs/core');
const typeorm_1 = require('typeorm');
const constants_1 = require('../../constants');
let TenantInterceptor = class TenantInterceptor {
  constructor(request, connection) {
    this.request = request;
    this.connection = connection;
  }
  intercept(context, next) {
    const tenantId = this.getTenantId();
    if (tenantId) {
      this.setupGlobalTenantFilter(tenantId);
    }
    return next.handle();
  }
  getTenantId() {
    const req = this.request;
    const tenantName = req?.headers?.[constants_1.TENANT_HEADER];
    if (!tenantName) {
      return null;
    }
    return req.tenantId || null;
  }
  setupGlobalTenantFilter(tenantId) {
    this.request.tenantId = tenantId;
  }
};
exports.TenantInterceptor = TenantInterceptor;
exports.TenantInterceptor = TenantInterceptor = __decorate(
  [
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata('design:paramtypes', [Object, typeorm_1.Connection]),
  ],
  TenantInterceptor,
);
//# sourceMappingURL=tenant.interceptor.js.map
