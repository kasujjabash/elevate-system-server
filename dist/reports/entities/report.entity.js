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
exports.Report = void 0;
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const report_submission_entity_1 = require('./report.submission.entity');
const user_entity_1 = require('../../users/entities/user.entity');
const report_field_entity_1 = require('./report.field.entity');
const report_enum_1 = require('../enums/report.enum');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
let Report = class Report {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      tenant: {
        required: true,
        type: () => require('../../tenants/entities/tenant.entity').Tenant,
      },
      name: { required: true, type: () => String },
      description: { required: true, type: () => String, nullable: true },
      functionName: { required: true, type: () => String, nullable: true },
      viewType: { required: true, type: () => Object },
      sqlQuery: { required: true, type: () => String },
      fields: {
        required: true,
        type: () => [require('./report.field.entity').ReportField],
      },
      displayColumns: { required: true, type: () => Object },
      footer: { required: true, type: () => [String] },
      labels: { required: true, type: () => [String] },
      dataPoints: { required: true, type: () => [Number] },
      submissionFrequency: { required: true, type: () => Object },
      submissions: {
        required: true,
        type: () => [require('./report.submission.entity').ReportSubmission],
      },
      user: {
        required: true,
        type: () => require('../../users/entities/user.entity').User,
      },
      active: { required: true, type: () => Boolean },
      groupFieldName: { required: false, type: () => String },
      status: {
        required: true,
        enum: require('../enums/report.enum').ReportStatus,
      },
    };
  }
};
exports.Report = Report;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Report.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => tenant_entity_1.Tenant,
      (tenant) => tenant.reports,
      { nullable: true },
    ),
    __metadata('design:type', tenant_entity_1.Tenant),
  ],
  Report.prototype,
  'tenant',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Report.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'description',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'functionName',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      default: 'table',
      enum: [
        'table',
        'piechart',
        'bargraph',
        'linechart',
        'scatterplot',
        'heatmap',
        'gaugechart',
        'treemap',
        'donutchart',
      ],
    }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'viewType',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'sqlQuery',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => report_field_entity_1.ReportField,
      (field) => field.report,
      {
        cascade: true,
      },
    ),
    __metadata('design:type', Array),
  ],
  Report.prototype,
  'fields',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata('design:type', Object),
  ],
  Report.prototype,
  'displayColumns',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata('design:type', Array),
  ],
  Report.prototype,
  'footer',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata('design:type', Array),
  ],
  Report.prototype,
  'labels',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata('design:type', Array),
  ],
  Report.prototype,
  'dataPoints',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: ['daily', 'weekly', 'monthly', 'custom'],
    }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'submissionFrequency',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => report_submission_entity_1.ReportSubmission,
      (submission) => submission.report,
    ),
    __metadata('design:type', Array),
  ],
  Report.prototype,
  'submissions',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => user_entity_1.User,
      (user) => user.reports,
    ),
    __metadata('design:type', user_entity_1.User),
  ],
  Report.prototype,
  'user',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ default: true }),
    __metadata('design:type', Boolean),
  ],
  Report.prototype,
  'active',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'groupFieldName',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: report_enum_1.ReportStatus,
      default: report_enum_1.ReportStatus.DRAFT,
    }),
    __metadata('design:type', String),
  ],
  Report.prototype,
  'status',
  void 0,
);
exports.Report = Report = __decorate(
  [(0, typeorm_1.Entity)(), (0, typeorm_1.Index)(['tenant', 'id'])],
  Report,
);
//# sourceMappingURL=report.entity.js.map
