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
exports.TenantContext = void 0;
const common_1 = require('@nestjs/common');
const core_1 = require('@nestjs/core');
const constants_1 = require('../../constants');
let TenantContext = class TenantContext {
  constructor(request) {
    this.request = request;
    this._tenantId = null;
    this._tenantName = null;
    this.initializeTenantContext();
  }
  initializeTenantContext() {
    const req = this.request;
    this._tenantName = req?.headers?.[constants_1.TENANT_HEADER] || null;
    this._tenantId = req?.tenantId || null;
  }
  get tenantId() {
    return this._tenantId;
  }
  get tenantName() {
    return this._tenantName;
  }
  setTenantId(tenantId) {
    this._tenantId = tenantId;
  }
  hasTenant() {
    return this._tenantId !== null;
  }
  requireTenant() {
    if (!this._tenantId) {
      throw new Error('Tenant context is required but not available');
    }
    return this._tenantId;
  }
};
exports.TenantContext = TenantContext;
exports.TenantContext = TenantContext = __decorate(
  [
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata('design:paramtypes', [Object]),
  ],
  TenantContext,
);
//# sourceMappingURL=tenant-context.js.map
