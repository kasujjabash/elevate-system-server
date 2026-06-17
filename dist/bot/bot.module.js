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
exports.BotModule = void 0;
const common_1 = require('@nestjs/common');
const bot_controller_1 = require('./bot.controller');
const bot_service_1 = require('./bot.service');
const session_service_1 = require('./session.service');
const typeorm_1 = require('@nestjs/typeorm');
const config_1 = require('../config');
const bot_helpers_1 = require('./bot.helpers');
const google_sheets_service_1 = require('./google-sheets.service');
let BotModule = class BotModule {};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [typeorm_1.TypeOrmModule.forFeature([...config_1.appEntities])],
      controllers: [bot_controller_1.BotController],
      providers: [
        bot_service_1.BotService,
        session_service_1.SessionService,
        google_sheets_service_1.GoogleSheetsService,
        ...bot_helpers_1.chatHandlerProviders,
      ],
    }),
  ],
  BotModule,
);
//# sourceMappingURL=bot.module.js.map
