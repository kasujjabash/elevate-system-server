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
exports.TenantsModule = void 0;
const common_1 = require('@nestjs/common');
const core_1 = require('@nestjs/core');
const tenants_service_1 = require('./tenants.service');
const db_service_1 = require('../shared/db.service');
const seed_module_1 = require('../seed/seed.module');
const constants_1 = require('../constants');
const users_module_1 = require('../users/users.module');
const tenant_context_1 = require('../shared/tenant/tenant-context');
const tenantValidationProvider = {
  provide: 'TENANT_VALIDATOR',
  scope: common_1.Scope.REQUEST,
  useFactory: async (req, dbservice) => {
    const url = req.url || '';
    if (url.startsWith('/api/auth/')) {
      return null;
    }
    const authHeader = req.headers.authorization;
    const hasJWT = authHeader && authHeader.startsWith('Bearer ');
    if (hasJWT) {
      return null;
    }
    const tenantName =
      req.headers[constants_1.TENANT_HEADER] || req.body?.hubName;
    if (!tenantName) {
      throw new common_1.BadRequestException(
        'No hub name provided. A valid hub name must be provided.',
      );
    }
    const tenantDetails = await dbservice.getTenantByName(tenantName);
    if (!tenantDetails) {
      throw new common_1.BadRequestException(
        'Invalid hub name provided. Please provide a valid hub name',
      );
    }
    req.tenantId = tenantDetails.id;
    req.tenantName = tenantDetails.name;
    return tenantDetails;
  },
  inject: [core_1.REQUEST, db_service_1.DbService],
};
const connectionFactory = {
  provide: 'CONNECTION',
  scope: common_1.Scope.REQUEST,
  useFactory: async (req, dbservice, tenantValidator) => {
    return dbservice.getConnection();
  },
  inject: [core_1.REQUEST, db_service_1.DbService, 'TENANT_VALIDATOR'],
};
let TenantsModule = class TenantsModule {};
exports.TenantsModule = TenantsModule;
exports.TenantsModule = TenantsModule = __decorate(
  [
    (0, common_1.Global)(),
    (0, common_1.Module)({
      imports: [
        (0, common_1.forwardRef)(() => seed_module_1.SeedModule),
        (0, common_1.forwardRef)(() => users_module_1.UsersModule),
      ],
      providers: [
        tenantValidationProvider,
        connectionFactory,
        tenants_service_1.TenantsService,
        db_service_1.DbService,
        tenant_context_1.TenantContext,
      ],
      exports: [
        'CONNECTION',
        'TENANT_VALIDATOR',
        tenant_context_1.TenantContext,
      ],
    }),
  ],
  TenantsModule,
);
//# sourceMappingURL=tenants.module.js.map
