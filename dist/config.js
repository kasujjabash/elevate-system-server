'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.appEntities = exports.normalizePort = void 0;
const users_helpers_1 = require('./users/users.helpers');
const crm_helpers_1 = require('./crm/crm.helpers');
const help_helpers_1 = require('./help/help.helpers');
const report_entity_1 = require('./reports/entities/report.entity');
const report_submission_entity_1 = require('./reports/entities/report.submission.entity');
const report_submission_data_entity_1 = require('./reports/entities/report.submission.data.entity');
const report_field_entity_1 = require('./reports/entities/report.field.entity');
require('dotenv').config();
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
exports.normalizePort = normalizePort;
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;
const database = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      cache: false,
      logging: process.env.DB_LOGGING === 'true',
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: normalizePort(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      database: process.env.DB_DATABASE,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      cache: false,
      logging: process.env.DB_LOGGING === 'true',
    };
const config = {
  app: {
    port: normalizePort(process.env.PORT),
  },
  database: database,
};
exports.default = config;
exports.appEntities = [
  ...users_helpers_1.usersEntities,
  ...crm_helpers_1.crmEntities,
  ...help_helpers_1.helpEntities,
  report_entity_1.Report,
  report_submission_entity_1.ReportSubmission,
  report_submission_data_entity_1.ReportSubmissionData,
  report_field_entity_1.ReportField,
];
console.log('#################appEntities#########', exports.appEntities);
//# sourceMappingURL=config.js.map
