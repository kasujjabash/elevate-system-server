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
Object.defineProperty(exports, '__esModule', { value: true });
exports.GoogleSheetsService = void 0;
const googleapis_1 = require('googleapis');
const process = require('process');
const common_1 = require('@nestjs/common');
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const sheetName = process.env.GOOGLE_SPREADSHEET_SHEET_NAME;
const credentialsFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let GoogleSheetsService = class GoogleSheetsService {
  async addRowToSheet(values) {
    try {
      const serviceAccountAuth = new googleapis_1.google.auth.GoogleAuth({
        keyFile: credentialsFile,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = googleapis_1.google.sheets({
        version: 'v4',
        auth: serviceAccountAuth,
      });
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });
      common_1.Logger.log('data added successfully');
    } catch (error) {
      common_1.Logger.error('Error adding row:' + error);
    }
  }
};
exports.GoogleSheetsService = GoogleSheetsService;
exports.GoogleSheetsService = GoogleSheetsService = __decorate(
  [(0, common_1.Injectable)()],
  GoogleSheetsService,
);
//# sourceMappingURL=google-sheets.service.js.map
