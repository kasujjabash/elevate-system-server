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
exports.UsersModule = void 0;
const common_1 = require('@nestjs/common');
const users_service_1 = require('./users.service');
const typeorm_1 = require('@nestjs/typeorm');
const users_helpers_1 = require('./users.helpers');
const users_controller_1 = require('./users.controller');
const crm_module_1 = require('../crm/crm.module');
const crm_helpers_1 = require('../crm/crm.helpers');
const app_service_1 = require('../app.service');
const jwt_strategy_1 = require('../auth/strategies/jwt.strategy');
const jwt_1 = require('@nestjs/jwt');
const constants_1 = require('../auth/constants');
const roles_service_1 = require('./roles.service');
const roles_controller_1 = require('./roles.controller');
const jwt_helpers_service_1 = require('../auth/jwt-helpers.service');
const prisma_service_1 = require('../shared/prisma.service');
let UsersModule = class UsersModule {};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate(
  [
    (0, common_1.Global)(),
    (0, common_1.Module)({
      imports: [
        typeorm_1.TypeOrmModule.forFeature([
          ...users_helpers_1.usersEntities,
          ...crm_helpers_1.crmEntities,
        ]),
        crm_module_1.CrmModule,
        jwt_1.JwtModule.register({
          secret: constants_1.jwtConstants.secret,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [
        users_service_1.UsersService,
        app_service_1.AppService,
        jwt_strategy_1.JwtStrategy,
        roles_service_1.RolesService,
        jwt_helpers_service_1.JwtHelperService,
        prisma_service_1.PrismaService,
      ],
      exports: [users_service_1.UsersService],
      controllers: [
        users_controller_1.UsersController,
        roles_controller_1.RolesController,
      ],
    }),
  ],
  UsersModule,
);
//# sourceMappingURL=users.module.js.map
