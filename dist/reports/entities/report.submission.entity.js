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
exports.ReportSubmission = void 0;
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const user_entity_1 = require('../../users/entities/user.entity');
const report_entity_1 = require('./report.entity');
const report_submission_data_entity_1 = require('./report.submission.data.entity');
let ReportSubmission = class ReportSubmission {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      submittedAt: { required: true, type: () => Date },
      user: {
        required: true,
        type: () => require('../../users/entities/user.entity').User,
      },
      report: { required: true, type: () => require('./report.entity').Report },
      data: { required: true, type: () => Object },
      submissionData: {
        required: true,
        type: () => [
          require('./report.submission.data.entity').ReportSubmissionData,
        ],
      },
    };
  }
};
exports.ReportSubmission = ReportSubmission;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  ReportSubmission.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata('design:type', Date),
  ],
  ReportSubmission.prototype,
  'submittedAt',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => user_entity_1.User,
      (user) => user.reportSubmissions,
    ),
    (0, typeorm_1.JoinColumn)(),
    __metadata('design:type', user_entity_1.User),
  ],
  ReportSubmission.prototype,
  'user',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => report_entity_1.Report,
      (report) => report.submissions,
    ),
    __metadata('design:type', report_entity_1.Report),
  ],
  ReportSubmission.prototype,
  'report',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata('design:type', Object),
  ],
  ReportSubmission.prototype,
  'data',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => report_submission_data_entity_1.ReportSubmissionData,
      (reportSubmissionData) => reportSubmissionData.reportSubmission,
    ),
    __metadata('design:type', Array),
  ],
  ReportSubmission.prototype,
  'submissionData',
  void 0,
);
exports.ReportSubmission = ReportSubmission = __decorate(
  [(0, typeorm_1.Entity)(), (0, typeorm_1.Index)(['submittedAt'])],
  ReportSubmission,
);
//# sourceMappingURL=report.submission.entity.js.map
