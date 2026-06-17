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
exports.User = void 0;
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const class_transformer_1 = require('class-transformer');
const bcrypt = require('bcrypt');
const contact_entity_1 = require('../../crm/entities/contact.entity');
const validation_1 = require('../../utils/validation');
const userRoles_entity_1 = require('./userRoles.entity');
const report_submission_entity_1 = require('../../reports/entities/report.submission.entity');
const report_entity_1 = require('../../reports/entities/report.entity');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
const hashCost = 10;
let User = class User {
  hashPassword() {
    if ((0, validation_1.hasValue)(this.password)) {
      this.password = bcrypt.hashSync(this.password, hashCost);
    }
  }
  async validatePassword(unencryptedPassword) {
    return await bcrypt.compare(unencryptedPassword, this.password);
  }
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      username: { required: true, type: () => String },
      password: { required: true, type: () => String },
      contact: {
        required: true,
        type: () => require('../../crm/entities/contact.entity').default,
      },
      contactId: { required: true, type: () => Number },
      isActive: { required: true, type: () => Boolean },
      roles: { required: true, type: () => String },
      hubId: { required: true, type: () => Number },
      tokenVersion: { required: true, type: () => Number },
      tenant: {
        required: true,
        type: () => require('../../tenants/entities/tenant.entity').Tenant,
      },
      userRoles: {
        required: true,
        type: () => [require('./userRoles.entity').default],
      },
      reportSubmissions: {
        required: true,
        type: () => [
          require('../../reports/entities/report.submission.entity')
            .ReportSubmission,
        ],
      },
      reports: {
        required: true,
        type: () => [require('../../reports/entities/report.entity').Report],
      },
    };
  }
};
exports.User = User;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  User.prototype,
  'id',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ length: 40 }), __metadata('design:type', String)],
  User.prototype,
  'username',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ length: 100, select: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata('design:type', String),
  ],
  User.prototype,
  'password',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToOne)((type) => contact_entity_1.default),
    (0, typeorm_1.JoinColumn)(),
    __metadata('design:type', contact_entity_1.default),
  ],
  User.prototype,
  'contact',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata('design:type', Number),
  ],
  User.prototype,
  'contactId',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Boolean)],
  User.prototype,
  'isActive',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata('design:type', String),
  ],
  User.prototype,
  'roles',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true, type: 'int' }),
    __metadata('design:type', Number),
  ],
  User.prototype,
  'hubId',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ default: 0, nullable: true, type: 'int' }),
    __metadata('design:type', Number),
  ],
  User.prototype,
  'tokenVersion',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => tenant_entity_1.Tenant,
      (tenant) => tenant.users,
      { nullable: true },
    ),
    __metadata('design:type', tenant_entity_1.Tenant),
  ],
  User.prototype,
  'tenant',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => userRoles_entity_1.default,
      (it) => it.user,
    ),
    __metadata('design:type', Array),
  ],
  User.prototype,
  'userRoles',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => report_submission_entity_1.ReportSubmission,
      (reportSubmission) => reportSubmission.user,
    ),
    __metadata('design:type', Array),
  ],
  User.prototype,
  'reportSubmissions',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => report_entity_1.Report,
      (report) => report.user,
    ),
    __metadata('design:type', Array),
  ],
  User.prototype,
  'reports',
  void 0,
);
exports.User = User = __decorate(
  [
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['username']),
    (0, typeorm_1.Index)(['tenant']),
  ],
  User,
);
//# sourceMappingURL=user.entity.js.map
