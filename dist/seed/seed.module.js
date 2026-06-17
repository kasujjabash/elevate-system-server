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
exports.SeedModule = void 0;
const common_1 = require('@nestjs/common');
const seed_service_1 = require('./seed.service');
const seed_controller_1 = require('./seed.controller');
const comprehensive_seed_service_1 = require('./comprehensive-seed.service');
const crm_module_1 = require('../crm/crm.module');
const users_module_1 = require('../users/users.module');
const reports_module_1 = require('../reports/reports.module');
const tenants_module_1 = require('../tenants/tenants.module');
const typeorm_1 = require('@nestjs/typeorm');
const crm_helpers_1 = require('../crm/crm.helpers');
const users_helpers_1 = require('../users/users.helpers');
let SeedModule = class SeedModule {};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [
        crm_module_1.CrmModule,
        users_module_1.UsersModule,
        reports_module_1.ReportsModule,
        (0, common_1.forwardRef)(() => tenants_module_1.TenantsModule),
        typeorm_1.TypeOrmModule.forFeature([
          ...users_helpers_1.usersEntities,
          ...crm_helpers_1.crmEntities,
        ]),
      ],
      controllers: [seed_controller_1.SeedController],
      providers: [
        seed_service_1.SeedService,
        comprehensive_seed_service_1.ComprehensiveSeedService,
      ],
      exports: [
        seed_service_1.SeedService,
        comprehensive_seed_service_1.ComprehensiveSeedService,
      ],
    }),
  ],
  SeedModule,
);
//# sourceMappingURL=seed.module.js.map
