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
exports.DbService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const typeorm_2 = require('typeorm');
const tenant_entity_1 = require('../tenants/entities/tenant.entity');
let DbService = class DbService {
  constructor(connection) {
    this.connection = connection;
  }
  async getConnection() {
    return this.connection;
  }
  async createTenant(tenantData) {
    common_1.Logger.log(`Creating tenant: ${tenantData.name}`);
    return await this.connection
      .getRepository(tenant_entity_1.Tenant)
      .save(tenantData);
  }
  async getTenantByName(name) {
    return await this.connection.getRepository(tenant_entity_1.Tenant).findOne({
      where: { name },
    });
  }
  async getTenantById(id) {
    return await this.connection.getRepository(tenant_entity_1.Tenant).findOne({
      where: { id },
    });
  }
};
exports.DbService = DbService;
exports.DbService = DbService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectConnection)()),
    __metadata('design:paramtypes', [typeorm_2.Connection]),
  ],
  DbService,
);
//# sourceMappingURL=db.service.js.map
