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
exports.ReportsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const jwt_auth_guard_1 = require('../auth/guards/jwt-auth.guard');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const swagger_1 = require('@nestjs/swagger');
const reports_service_1 = require('./reports.service');
const report_submission_dto_1 = require('./dto/report-submission.dto');
let ReportsController = class ReportsController {
  constructor(reportService) {
    this.reportService = reportService;
  }
  createReport(reportDto, request) {
    return this.reportService.createReport(reportDto, request.user);
  }
  async submitReport(reportId, submissionDto, request) {
    console.log(
      '📝 ReportsController.submitReport() - Called with reportId:',
      reportId,
    );
    submissionDto.reportId = reportId;
    return await this.reportService.submitReport(submissionDto, request.user);
  }
  async getAllSubmissions(limit = 20, offset = 0, request) {
    try {
      return await this.reportService.getMySubmissions(request.user, {
        limit,
        offset,
      });
    } catch {
      return {
        submissions: [],
        pagination: { total: 0, limit, offset, hasMore: false },
      };
    }
  }
  async getMySubmissions(limit = 20, offset = 0, reportId, request) {
    try {
      return await this.reportService.getMySubmissions(request.user, {
        limit,
        offset,
        reportId,
      });
    } catch {
      return {
        submissions: [],
        pagination: { total: 0, limit, offset, hasMore: false },
      };
    }
  }
  async getTeamSubmissions(reportId, request) {
    try {
      return await this.reportService.getTeamSubmissions(request.user, {
        reportId,
      });
    } catch {
      return { submissions: [], pagination: { total: 0 } };
    }
  }
  async getSubmissionDetails(id, request) {
    console.log(
      '📋 ReportsController.getSubmissionDetails() - Called with id:',
      id,
    );
    return await this.reportService.getSubmissionDetails(id, request.user);
  }
  async getReport(reportId) {
    console.log(
      '📄 ReportsController.getReport() - Called with reportId:',
      reportId,
    );
    const parsedId = parseInt(reportId, 10);
    if (isNaN(parsedId)) {
      console.log(
        '📄 ReportsController.getReport() - Invalid ID provided:',
        reportId,
      );
      throw new common_1.BadRequestException('Invalid report ID provided');
    }
    return await this.reportService.getReport(parsedId);
  }
  async updateReport(id, updateDto) {
    return await this.reportService.updateReport(id, updateDto);
  }
  async getAllReports() {
    console.log('📋 ReportsController.getAllReports() - Starting execution');
    try {
      const result = await this.reportService.getAllReports();
      console.log(
        '📋 ReportsController.getAllReports() - Success, returning:',
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.error('📋 ReportsController.getAllReports() - Error:', error);
      throw error;
    }
  }
  async getReportSubmissions(
    reportId,
    startDate,
    endDate,
    smallGroupIdList,
    parentGroupIdList,
  ) {
    console.log(
      '📊 ReportsController.getReportSubmissions() - Called with reportId:',
      reportId,
    );
    const formattedStartDate = startDate ? new Date(startDate) : undefined;
    const formattedEndDate = endDate ? new Date(endDate) : undefined;
    return await this.reportService.generateReport(
      reportId,
      formattedStartDate,
      formattedEndDate,
      smallGroupIdList,
      parentGroupIdList,
    );
  }
  async getReportSubmission(reportId, submissionId) {
    console.log(
      '🔍 ReportsController.getReportSubmission() - Called with reportId:',
      reportId,
      'submissionId:',
      submissionId,
    );
    return this.reportService.getReportSubmission(reportId, submissionId);
  }
  async sendReportSubmissionsWeeklyEmail(
    reportId,
    smallGroupIdList,
    parentGroupIdList,
  ) {
    console.log(
      '📧 ReportsController.sendReportSubmissionsWeeklyEmail() - Called with reportId:',
      reportId,
    );
    return await this.reportService.sendWeeklyEmailSummary(
      reportId,
      smallGroupIdList,
      parentGroupIdList,
    );
  }
};
exports.ReportsController = ReportsController;
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'createReport',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':reportId/submissions'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('reportId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Number,
      report_submission_dto_1.ReportSubmissionDto,
      Object,
    ]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'submitReport',
  null,
);
__decorate(
  [
    (0, common_1.Get)('submissions'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getAllSubmissions',
  null,
);
__decorate(
  [
    (0, common_1.Get)('submissions/me'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('reportId')),
    __param(3, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Number, Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getMySubmissions',
  null,
);
__decorate(
  [
    (0, common_1.Get)('submissions/team'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('reportId')),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getTeamSubmissions',
  null,
);
__decorate(
  [
    (0, common_1.Get)('submissions/:id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getSubmissionDetails',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('./entities/report.entity').Report,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getReport',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('./entities/report.entity').Report,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'updateReport',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getAllReports',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':reportId/submissions'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('reportId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('groupIdList')),
    __param(4, (0, common_1.Query)('parentGroupIdList')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, String, String, String, String]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getReportSubmissions',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':reportId/submissions/:submissionId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Param)('submissionId')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Number]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'getReportSubmission',
  null,
);
__decorate(
  [
    (0, common_1.Post)(':reportId/send-weekly-email'),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Param)('reportId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('groupIdList')),
    __param(2, (0, common_1.Query)('parentGroupIdList')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, String, String]),
    __metadata('design:returntype', Promise),
  ],
  ReportsController.prototype,
  'sendReportSubmissionsWeeklyEmail',
  null,
);
exports.ReportsController = ReportsController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('api/reports'),
    __metadata('design:paramtypes', [reports_service_1.ReportsService]),
  ],
  ReportsController,
);
//# sourceMappingURL=reports.controller.js.map
