'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ReportStatus =
  exports.ReportSubmissionFrequency =
  exports.ReportFieldType =
  exports.ReportType =
    void 0;
var ReportType;
(function (ReportType) {
  ReportType['TABLE'] = 'table';
  ReportType['PIECHART'] = 'piechart';
  ReportType['BARGRAPH'] = 'bargraph';
  ReportType['LINECHART'] = 'linechart';
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportFieldType;
(function (ReportFieldType) {
  ReportFieldType['Text'] = 'text';
  ReportFieldType['TextArea'] = 'textarea';
  ReportFieldType['Number'] = 'number';
  ReportFieldType['Date'] = 'date';
  ReportFieldType['Boolean'] = 'boolean';
  ReportFieldType['Checkbox'] = 'checkbox';
  ReportFieldType['Radio'] = 'radio';
})(ReportFieldType || (exports.ReportFieldType = ReportFieldType = {}));
var ReportSubmissionFrequency;
(function (ReportSubmissionFrequency) {
  ReportSubmissionFrequency['Daily'] = 'daily';
  ReportSubmissionFrequency['Weekly'] = 'weekly';
  ReportSubmissionFrequency['Monthly'] = 'monthly';
  ReportSubmissionFrequency['Custom'] = 'custom';
})(
  ReportSubmissionFrequency ||
    (exports.ReportSubmissionFrequency = ReportSubmissionFrequency = {}),
);
var ReportStatus;
(function (ReportStatus) {
  ReportStatus['DRAFT'] = 'draft';
  ReportStatus['ACTIVE'] = 'active';
  ReportStatus['INACTIVE'] = 'inactive';
  ReportStatus['ARCHIVED'] = 'archived';
  ReportStatus['PENDING'] = 'pending';
  ReportStatus['SUBMITTED'] = 'submitted';
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
//# sourceMappingURL=report.enum.js.map
