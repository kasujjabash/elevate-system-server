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
exports.Tenant = void 0;
const openapi = require('@nestjs/swagger');
const contact_entity_1 = require('../../crm/entities/contact.entity');
const help_entity_1 = require('../../help/entities/help.entity');
const roles_entity_1 = require('../../users/entities/roles.entity');
const report_entity_1 = require('../../reports/entities/report.entity');
const user_entity_1 = require('../../users/entities/user.entity');
const typeorm_1 = require('typeorm');
let Tenant = class Tenant {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      name: { required: true, type: () => String },
      description: { required: true, type: () => String },
      users: {
        required: true,
        type: () => [require('../../users/entities/user.entity').User],
      },
      contacts: {
        required: true,
        type: () => [require('../../crm/entities/contact.entity').default],
      },
      groups: { required: true, type: () => [Object] },
      groupCategories: { required: true, type: () => [Object] },
      eventCategories: { required: true, type: () => [Object] },
      roles: {
        required: true,
        type: () => [require('../../users/entities/roles.entity').default],
      },
      helpArticles: {
        required: true,
        type: () => [require('../../help/entities/help.entity').default],
      },
      chatSessions: { required: true, type: () => [Object] },
      reports: {
        required: true,
        type: () => [require('../../reports/entities/report.entity').Report],
      },
    };
  }
};
exports.Tenant = Tenant;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Tenant.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'varchar', unique: true, length: 100 }),
    __metadata('design:type', String),
  ],
  Tenant.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata('design:type', String),
  ],
  Tenant.prototype,
  'description',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => user_entity_1.User,
      (user) => user.tenant,
    ),
    __metadata('design:type', Array),
  ],
  Tenant.prototype,
  'users',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => contact_entity_1.default,
      (contact) => contact.tenant,
    ),
    __metadata('design:type', Array),
  ],
  Tenant.prototype,
  'contacts',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => roles_entity_1.default,
      (role) => role.tenant,
    ),
    __metadata('design:type', Array),
  ],
  Tenant.prototype,
  'roles',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => help_entity_1.default,
      (help) => help.tenant,
    ),
    __metadata('design:type', Array),
  ],
  Tenant.prototype,
  'helpArticles',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => report_entity_1.Report,
      (report) => report.tenant,
    ),
    __metadata('design:type', Array),
  ],
  Tenant.prototype,
  'reports',
  void 0,
);
exports.Tenant = Tenant = __decorate([(0, typeorm_1.Entity)()], Tenant);
//# sourceMappingURL=tenant.entity.js.map
