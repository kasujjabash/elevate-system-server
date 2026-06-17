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
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const userRoles_entity_1 = require('./userRoles.entity');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
let Roles = class Roles {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      tenant: {
        required: true,
        type: () => require('../../tenants/entities/tenant.entity').Tenant,
      },
      role: { required: true, type: () => String },
      description: { required: true, type: () => String },
      permissions: { required: true, type: () => [String] },
      isActive: { required: true, type: () => Boolean },
      createdOn: { required: true, type: () => Date },
      modifiedOn: { required: true, type: () => Date },
      rolesUser: {
        required: true,
        type: () => [require('./userRoles.entity').default],
      },
    };
  }
};
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Roles.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => tenant_entity_1.Tenant,
      (tenant) => tenant.roles,
      { nullable: true },
    ),
    __metadata('design:type', tenant_entity_1.Tenant),
  ],
  Roles.prototype,
  'tenant',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata('design:type', String),
  ],
  Roles.prototype,
  'role',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata('design:type', String),
  ],
  Roles.prototype,
  'description',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)('simple-array', { nullable: false }),
    __metadata('design:type', Array),
  ],
  Roles.prototype,
  'permissions',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata('design:type', Boolean),
  ],
  Roles.prototype,
  'isActive',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.CreateDateColumn)({
      default: () => 'NOW()',
      nullable: false,
    }),
    __metadata('design:type', Date),
  ],
  Roles.prototype,
  'createdOn',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.UpdateDateColumn)({
      default: () => 'NOW()',
      nullable: false,
    }),
    __metadata('design:type', Date),
  ],
  Roles.prototype,
  'modifiedOn',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => userRoles_entity_1.default,
      (it) => it.roles,
    ),
    __metadata('design:type', Array),
  ],
  Roles.prototype,
  'rolesUser',
  void 0,
);
Roles = __decorate(
  [
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(['tenant', 'id']),
    (0, typeorm_1.Index)(['role']),
  ],
  Roles,
);
exports.default = Roles;
//# sourceMappingURL=roles.entity.js.map
