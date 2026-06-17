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
exports.BotController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const swagger_1 = require('@nestjs/swagger');
const bot_service_1 = require('./bot.service');
const ussd_request_dto_1 = require('./dto/ussd-request.dto');
const ussd_response_dto_1 = require('./dto/ussd-response.dto');
const bot_helpers_1 = require('./bot.helpers');
const google_sheets_service_1 = require('./google-sheets.service');
const date_fns_1 = require('date-fns');
let BotController = class BotController {
  constructor(service, sheetsService) {
    this.service = service;
    this.sheetsService = sheetsService;
  }
  async test() {
    const event = '-NA-';
    const date = (0, date_fns_1.format)(new Date(), 'dd/MM/yyyy');
    this.sheetsService
      .addRowToSheet([
        ['Sample Name', date, event, '0700111111', 'Sample Address'],
      ])
      .then(() => {
        console.log('Successfully added row to sheet');
      });
    return 'It works!';
  }
  async africaZTalking(request) {
    const requestData = {
      ...request,
      text: (0, bot_helpers_1.cleanUp)(request.text),
    };
    const response = await this.service.process(requestData);
    const action =
      response.nodeAction === ussd_response_dto_1.ChatAction.Prompt
        ? 'CON '
        : 'END ';
    return action + response.message;
  }
};
exports.BotController = BotController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise),
  ],
  BotController.prototype,
  'test',
  null,
);
__decorate(
  [
    (0, common_1.Post)('ussd/at'),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [ussd_request_dto_1.UssdRequestDto]),
    __metadata('design:returntype', Promise),
  ],
  BotController.prototype,
  'africaZTalking',
  null,
);
exports.BotController = BotController = __decorate(
  [
    (0, common_1.Controller)('api/bot'),
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiTags)('USSD'),
    __metadata('design:paramtypes', [
      bot_service_1.BotService,
      google_sheets_service_1.GoogleSheetsService,
    ]),
  ],
  BotController,
);
//# sourceMappingURL=bot.controller.js.map
