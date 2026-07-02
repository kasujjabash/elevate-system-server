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
exports.ReportsService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('typeorm');
const report_entity_1 = require('./entities/report.entity');
const report_submission_entity_1 = require('./entities/report.submission.entity');
const user_entity_1 = require('../users/entities/user.entity');
const mailer_1 = require('../utils/mailer');
const stringHelpers_1 = require('../utils/stringHelpers');
const users_service_1 = require('../users/users.service');
const report_field_entity_1 = require('./entities/report.field.entity');
const report_submission_data_entity_1 = require('./entities/report.submission.data.entity');
const report_enum_1 = require('./enums/report.enum');
let ReportsService = class ReportsService {
  constructor(connection, usersService) {
    this.usersService = usersService;
    this.reportRepository = connection.getRepository(report_entity_1.Report);
    this.reportFieldRepository = connection.getRepository(
      report_field_entity_1.ReportField,
    );
    this.reportSubmissionDataRepository = connection.getRepository(
      report_submission_data_entity_1.ReportSubmissionData,
    );
    this.reportSubmissionRepository = connection.getRepository(
      report_submission_entity_1.ReportSubmission,
    );
    this.userRepository = connection.getRepository(user_entity_1.User);
  }
  async createReport(reportDto, user) {
    const report = new report_entity_1.Report();
    report.name = reportDto.name;
    report.description = reportDto.description;
    report.submissionFrequency = reportDto.submissionFrequency;
    report.viewType = reportDto.viewType;
    report.displayColumns = reportDto.displayColumns;
    report.user = await this.userRepository.findOne({ where: { id: user.id } });
    const fields = reportDto.fields.map((fieldDto) => {
      const field = new report_field_entity_1.ReportField();
      field.name = fieldDto.name;
      field.type = fieldDto.type;
      field.label = fieldDto.label;
      field.required = fieldDto.required;
      field.options = fieldDto.options;
      return field;
    });
    report.fields = fields;
    Object.assign(report, reportDto);
    await this.reportRepository.save(report);
    return reportDto;
  }
  async submitReport(submissionDto, user) {
    const { reportId, data } = submissionDto;
    const report = await this.reportRepository.findOne({
      where: { id: reportId, status: report_enum_1.ReportStatus.ACTIVE },
    });
    if (!report) {
      throw new common_1.NotFoundException(
        `Report with ID ${reportId} not found`,
      );
    }
    const submittingUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!submittingUser) {
      throw new common_1.NotFoundException(`User with ID ${user.id} not found`);
    }
    const reportSubmission = new report_submission_entity_1.ReportSubmission();
    reportSubmission.report = report;
    reportSubmission.submittedAt = new Date();
    reportSubmission.user = submittingUser;
    const savedSubmission =
      await this.reportSubmissionRepository.save(reportSubmission);
    const fields = await this.reportFieldRepository.find({
      where: { report: { id: report.id } },
    });
    const fieldNameToFieldMap = new Map(
      fields.map((field) => [field.name, field]),
    );
    const submissionDataEntities = Object.entries(data).map(
      ([fieldName, fieldValue]) => {
        const field = fieldNameToFieldMap.get(fieldName);
        if (!field) {
          throw new Error(`Field with name '${fieldName}' not found in report`);
        }
        const submissionData =
          new report_submission_data_entity_1.ReportSubmissionData();
        submissionData.reportSubmission = savedSubmission;
        submissionData.reportField = field;
        submissionData.fieldValue = fieldValue;
        return submissionData;
      },
    );
    await this.reportSubmissionDataRepository.save(submissionDataEntities);
    const response = {
      data: {
        reportId: savedSubmission.report.id,
        submissionId: savedSubmission.id,
        submittedAt: savedSubmission.submittedAt,
        submittedBy: savedSubmission.user.username,
      },
      status: common_1.HttpStatus.OK,
      message: 'Report submitted successfully.',
    };
    const formattedDate = (0, stringHelpers_1.getHumanReadableDate)(
      savedSubmission.submittedAt,
    );
    const fullName = (0, stringHelpers_1.getUserDisplayName)(
      savedSubmission.user,
    );
    await this.sendMail(
      savedSubmission.user.username,
      'Elevate Academy - Report Submitted',
      { submissionDate: formattedDate, fullName },
    );
    return response;
  }
  async getAllReports() {
    console.log('🔧 ReportsService.getAllReports() - Starting execution');
    try {
      console.log('🔧 ReportsService.getAllReports() - Querying database...');
      const reports = await this.reportRepository.find({
        where: { status: report_enum_1.ReportStatus.ACTIVE },
        relations: ['fields'],
      });
      console.log(
        '🔧 ReportsService.getAllReports() - Found reports:',
        reports.length,
      );
      console.log(
        '🔧 ReportsService.getAllReports() - Raw reports:',
        JSON.stringify(
          reports.map((r) => ({ id: r.id, name: r.name })),
          null,
          2,
        ),
      );
      console.log('🔧 ReportsService.getAllReports() - Formatting reports...');
      const formattedReports = reports.map((report) => {
        console.log(`🔧 Formatting report ${report.id}: ${report.name}`);
        return {
          id: report.id,
          name: report.name,
          description: report.description,
          submissionFrequency: report.submissionFrequency,
          active: report.active,
          status: report.status,
          targetGroupCategory: null,
          fieldCount: report.fields ? report.fields.length : 0,
        };
      });
      const result = { reports: formattedReports };
      console.log(
        '🔧 ReportsService.getAllReports() - Returning result:',
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.error('🔧 ReportsService.getAllReports() - Error:', error);
      throw error;
    }
  }
  async getReport(reportId) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId, status: report_enum_1.ReportStatus.ACTIVE },
      relations: ['fields', 'targetGroupCategory'],
    });
    if (!report) {
      throw new common_1.NotFoundException(
        `Report with ID ${reportId} not found`,
      );
    }
    return report;
  }
  getWeekNumber(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const offset = (firstDayOfWeek < 1 ? 7 : 0) - firstDayOfWeek + 1;
    return Math.ceil((date.getDate() + offset) / 7);
  }
  async getAllSmallGroups() {
    return [];
  }
  async generateReport(
    reportId,
    startDate,
    endDate,
    smallGroupIdList,
    parentGroupIdList,
  ) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['fields', 'submissions'],
    });
    if (!report) {
      throw new common_1.NotFoundException(
        `Report with ID ${reportId} not found`,
      );
    }
    switch (report.functionName) {
      case 'getSmallGroupSummaryAttendance':
        return this.getSmallGroupSummaryAttendance(
          report,
          startDate,
          endDate,
          smallGroupIdList,
          parentGroupIdList,
        );
      case 'getSmallGroupReportSubmissionStatus':
        return this.getSmallGroupReportSubmissionStatus(
          report,
          startDate,
          endDate,
        );
      default:
        throw new Error(
          `Function ${report.functionName} is not implemented for custom processing of report ID ${reportId}`,
        );
    }
  }
  async buildSubmissionQuery(reportId, startDate, endDate, smallGroupIds) {
    let query = this.reportSubmissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.report', 'report')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.submissionData', 'submissionData')
      .leftJoinAndSelect('submissionData.reportField', 'reportField')
      .where('report.id = :reportId', { reportId })
      .andWhere('submission.submittedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    if (smallGroupIds && smallGroupIds.length > 0) {
      query = query.andWhere(
        "reportField.name = 'smallGroupId' AND submissionData.fieldValue IN (:...smallGroupIds)",
        { smallGroupIds },
      );
    }
    return query;
  }
  async getSmallGroupSummaryAttendance(
    report,
    startDate,
    endDate,
    smallGroupIdList,
    parentGroupIdList,
  ) {
    const now = new Date();
    if (!startDate) {
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
    }
    if (!endDate) {
      endDate = new Date(now.setDate(now.getDate() + 6));
    }
    let smallGroupIds = [];
    if (smallGroupIdList) {
      smallGroupIds = smallGroupIdList.split(',').map(Number);
    }
    const query = await this.buildSubmissionQuery(
      report.id,
      startDate,
      endDate,
      smallGroupIds,
    );
    const submissions = await query.getMany();
    const submissionResponses = await Promise.all(
      submissions.map(async (submission) => {
        const transformedData = {
          id: submission.id,
          submittedAt: submission.submittedAt.toISOString(),
          submittedBy: (0, stringHelpers_1.getUserDisplayName)(submission.user),
        };
        const smallGroupFieldData = submission.submissionData.find(
          (sd) => sd.reportField.name === 'smallGroupId',
        );
        transformedData['parentGroupName'] = '';
        submission.submissionData.forEach((sd) => {
          transformedData[sd.reportField.name] = sd.fieldValue;
        });
        return transformedData;
      }),
    );
    const reportColumns = Object.values(report.displayColumns);
    return {
      reportId: report.id,
      data: submissionResponses,
      columns: [
        ...reportColumns,
        { label: 'Submitted At', name: 'submittedAt' },
        { label: 'Submitted By', name: 'submittedBy' },
      ],
      footer: report.footer,
    };
  }
  async getSmallGroupReportSubmissionStatus(report, startDate, endDate) {
    const now = new Date();
    if (!startDate) {
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
    }
    if (!endDate) {
      endDate = new Date(now.setDate(now.getDate() + 6));
    }
    const weekNumber = this.getWeekNumber(startDate);
    const allSmallGroups = await this.getAllSmallGroups();
    const smallGroupIds = allSmallGroups.map((group) => group.id);
    const smallGroupReportId = 1;
    const query = await this.buildSubmissionQuery(
      smallGroupReportId,
      startDate,
      endDate,
      smallGroupIds,
    );
    const submissions = await query.getMany();
    const submissionResponses = allSmallGroups.map((group) => {
      const submission = submissions.find((sub) =>
        sub.submissionData.some(
          (sd) =>
            sd.reportField.name === 'smallGroupId' &&
            sd.fieldValue === group.id.toString(),
        ),
      );
      const isSubmitted = !!submission;
      const smallGroupFieldData = submission?.submissionData.find(
        (sd) => sd.reportField.name === 'smallGroupId',
      );
      return {
        smallGroupName: group.name,
        weekNumber,
        reportSubmissionStatus: isSubmitted ? 'Submitted' : 'Not Submitted',
        submittedAt: isSubmitted ? submission.submittedAt.toISOString() : '-',
        submittedBy: isSubmitted
          ? (0, stringHelpers_1.getUserDisplayName)(submission.user)
          : '-',
        missingReports: isSubmitted ? 0 : 1,
      };
    });
    const reportColumns = Object.values(report.displayColumns);
    return {
      reportId: report.id,
      data: submissionResponses,
      columns: [
        ...reportColumns,
        { label: 'Submitted At', name: 'submittedAt' },
        { label: 'Submitted By', name: 'submittedBy' },
      ],
      footer: report.footer,
    };
  }
  async getReportSubmission(reportId, submissionId) {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id: submissionId, report: { id: reportId } },
      relations: ['user', 'submissionData', 'submissionData.reportField'],
    });
    if (!submission) {
      throw new common_1.NotFoundException(
        `Report submission with ID ${submissionId} not found`,
      );
    }
    const data = submission.submissionData.reduce((acc, curr) => {
      acc[curr.reportField.name] = curr.fieldValue;
      return acc;
    }, {});
    const labels = submission.submissionData.map((sd) => {
      return {
        name: sd.reportField.name,
        label: sd.reportField.label,
      };
    });
    return {
      id: submission.id,
      data: data,
      labels: labels,
      submittedAt: submission.submittedAt.toISOString(),
      submittedBy: (0, stringHelpers_1.getUserDisplayName)(submission.user),
    };
  }
  async updateReport(id, updateDto) {
    const { fields, ...reportUpdateData } = updateDto;
    await this.reportRepository.update(id, reportUpdateData);
    if (fields) {
      await this.updateReportFields(id, fields);
    }
    const updatedReport = await this.reportRepository.findOne({
      where: { id },
      relations: ['fields'],
    });
    if (!updatedReport) {
      throw new common_1.NotFoundException(`Report with ID ${id} not found`);
    }
    return updatedReport;
  }
  async updateReportFields(reportId, fieldsData) {
    const existingFields = await this.reportFieldRepository.find({
      where: { report: { id: reportId } },
    });
    const existingFieldsMap = new Map(
      existingFields.map((field) => [field.name, field]),
    );
    for (const [fieldName, fieldAttributes] of Object.entries(fieldsData)) {
      if (existingFieldsMap.has(fieldName)) {
        const existingField = existingFieldsMap.get(fieldName);
        await this.reportFieldRepository.update(existingField.id, {
          ...fieldAttributes,
        });
        existingFieldsMap.delete(fieldName);
      } else {
        await this.reportFieldRepository.save({
          ...fieldAttributes,
          name: fieldName,
          report: { id: reportId },
        });
      }
    }
    for (const [fieldName, existingField] of existingFieldsMap) {
      await this.reportFieldRepository.delete(existingField.id);
    }
  }
  async sendWeeklyEmailSummary(reportId, smallGroupIdList, parentGroupIdList) {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDayOfWeek + 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['fields', 'submissions'],
    });
    if (!report) {
      throw new common_1.NotFoundException(
        `Report with ID ${reportId} not found`,
      );
    }
    const reportData = await this.getSmallGroupSummaryAttendance(
      report,
      startDate,
      endDate,
      smallGroupIdList,
      parentGroupIdList,
    );
    const columns = reportData.columns;
    const reportsByZone = {};
    reportData.data.forEach((report) => {
      const zoneName = report.parentGroupName || 'Other';
      if (!reportsByZone[zoneName]) {
        reportsByZone[zoneName] = [];
      }
      reportsByZone[zoneName].push(report);
    });
    let tableHTML = `
      <table>
        <thead>
          <tr>
            ${columns.map((column) => `<th>${column.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;
    Object.entries(reportsByZone).forEach(([zoneName, zoneReports]) => {
      tableHTML += `<tr><th colspan="${columns.length}">${zoneName}</th></tr>`;
      zoneReports.forEach((report) => {
        tableHTML += `
          <tr>
            ${columns
              .map((column) => `<td>${report[column.name]}</td>`)
              .join('')}
          </tr>
        `;
      });
    });
    tableHTML += `
        </tbody>
      </table>
    `;
    const fullHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly MC Reports</title>
        <style>
            table {
                font-family: Arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
            }
    
            th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
            }
    
            th {
                background-color: #f2f2f2;
            }
    
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
    
            h1 {
                font-size: 24px;
            }
        </style>
        </head>
        <body>
          <h1>Weekly MC Reports</h1>
          ${tableHTML}
        </body>
      </html>
    `;
    const usersWithRole = await this.usersService.findByRole('Report Champion');
    const emailAddresses = usersWithRole.map((user) => user.username);
    if (!emailAddresses.length) {
      return 'Error | Weekly email not sent';
    }
    const mailerData = {
      to: emailAddresses.join(', '),
      subject: 'Elevate Academy | Weekly MC Reports Submitted',
      html: fullHTML,
    };
    (0, mailer_1.sendEmail)(mailerData);
    return 'Weekly email sent successfully';
  }
  sendMail(to, subject, mailArgs) {
    const mailerData = {
      to: to,
      subject: subject,
      html: `
            <p>Hello ${mailArgs.fullName},</p></br>
            <p>Your report has been successfully submitted on ${mailArgs.submissionDate}!</p></br>
        `,
    };
    return (0, mailer_1.sendEmail)(mailerData);
  }
  async getMySubmissions(user, options) {
    const { limit = 20, offset = 0, reportId } = options;
    const where = { user: { id: user.id } };
    if (reportId) {
      where.report = { id: reportId };
    }
    const submissions = await this.reportSubmissionRepository.find({
      where,
      relations: [
        'report',
        'submissionData',
        'submissionData.reportField',
        'user',
      ],
      order: { submittedAt: 'DESC' },
      skip: offset,
      take: limit,
    });
    const total = await this.reportSubmissionRepository.count({ where });
    return {
      submissions: submissions.map((submission) => ({
        id: submission.id,
        reportId: submission.report.id,
        reportName: submission.report.name,
        groupId: null,
        groupName: null,
        submittedAt: submission.submittedAt,
        submittedBy: {
          id: submission.user.id,
          name: (0, stringHelpers_1.getUserDisplayName)(submission.user),
        },
        status: report_enum_1.ReportStatus.SUBMITTED,
        data: submission.submissionData.reduce((acc, curr) => {
          acc[curr.reportField.name] = curr.fieldValue;
          return acc;
        }, {}),
        canEdit: false,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: total > offset + limit,
      },
    };
  }
  async getTeamSubmissions(user, options) {
    const { reportId } = options;
    const userGroupIds = [];
    const where = {};
    if (reportId) {
      where.report = { id: reportId };
    }
    if (userGroupIds.length > 0) {
      where.groupId = (0, typeorm_1.In)(userGroupIds);
    }
    const submissions = await this.reportSubmissionRepository.find({
      where,
      relations: [
        'report',
        'user',
        'submissionData',
        'submissionData.reportField',
      ],
      order: { submittedAt: 'DESC' },
    });
    return {
      submissions: submissions.map((submission) => ({
        id: submission.id,
        reportId: submission.report.id,
        reportName: submission.report.name,
        submittedAt: submission.submittedAt,
        submittedBy: (0, stringHelpers_1.getUserDisplayName)(submission.user),
        status: report_enum_1.ReportStatus.SUBMITTED,
        groupId: null,
      })),
    };
  }
  async getSubmissionDetails(submissionId, user) {
    const submission = await this.reportSubmissionRepository.findOne({
      where: { id: submissionId },
      relations: [
        'report',
        'user',
        'submissionData',
        'submissionData.reportField',
      ],
    });
    if (!submission) {
      throw new common_1.NotFoundException('Submission not found');
    }
    const data = submission.submissionData.reduce((acc, curr) => {
      acc[curr.reportField.name] = curr.fieldValue;
      return acc;
    }, {});
    return {
      id: submission.id,
      reportId: submission.report.id,
      reportName: submission.report.name,
      submittedAt: submission.submittedAt,
      submittedBy: (0, stringHelpers_1.getUserDisplayName)(submission.user),
      status: report_enum_1.ReportStatus.SUBMITTED,
      groupId: null,
      data,
    };
  }
  async validateUserGroupPermission(_contactId, _groupId, _categoryId) {
    return true;
  }
  async getUserGroupsInCategory(_contactId, _categoryId) {
    return [];
  }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      users_service_1.UsersService,
    ]),
  ],
  ReportsService,
);
//# sourceMappingURL=reports.service.js.map
