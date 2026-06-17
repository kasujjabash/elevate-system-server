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
exports.BotService = void 0;
const common_1 = require('@nestjs/common');
const session_service_1 = require('./session.service');
const ussd_response_dto_1 = require('./dto/ussd-response.dto');
const handler_interface_1 = require('./chat-flows/handler-interface');
const core_1 = require('@nestjs/core');
const bot_helpers_1 = require('./bot.helpers');
const welcome_handler_1 = require('./chat-flows/welcome-handler');
let BotService = class BotService {
  constructor(sessionService, moduleRef) {
    this.sessionService = sessionService;
    this.moduleRef = moduleRef;
  }
  async process(request) {
    const logTag = `BotService.process ${request.phoneNumber} ${request.sessionId}`;
    common_1.Logger.log(`${logTag} started`);
    const session = await this.sessionService.loadSession(request);
    const userInput = request.text?.trim().split('*').pop() ?? '';
    session.userPath = userInput;
    let nextHandler;
    if (userInput === 'exit') {
      nextHandler = handler_interface_1.ExitChatHandler.name;
    } else if (session.nodes.length === 0) {
      nextHandler = welcome_handler_1.WelcomeHandler.name;
      common_1.Logger.log(`${logTag} using RootHandler`);
    } else if (userInput === '00') {
      common_1.Logger.log(`${logTag} popping chat node`);
      return await this.sessionService.popChatNode(session);
    } else {
      const lastNode = session.nodes[session.nodes.length - 1];
      nextHandler = lastNode.nextHandler;
    }
    const handlerService = this.getHandlerService(nextHandler);
    if (!handlerService) {
      common_1.Logger.error(`Handler not found: ${nextHandler}`);
      return this.errorChatNode(session, request.text);
    }
    common_1.Logger.log(`${logTag} using ${handlerService.constructor.name}`);
    const result = await handlerService.execute(userInput, session);
    await this.sessionService.updateSession(session, result);
    return result;
  }
  getHandlerService(handlerName) {
    common_1.Logger.log(`getHandlerService ${handlerName}`);
    try {
      const handler = bot_helpers_1.chatHandlerProviders.find(
        (handler) => handler.name === handlerName,
      );
      return this.moduleRef.get(handler, { strict: false });
    } catch (e) {
      common_1.Logger.error(`getHandlerService ${handlerName} failed`, e);
      return null;
    }
  }
  errorChatNode(session, text) {
    return {
      name: 'Error',
      userInput: text,
      message: 'Sorry, something went wrong. Please try again later.',
      nodeAction: ussd_response_dto_1.ChatAction.End,
      session,
      hasError: true,
      sessionId: session.id,
      nextHandler: 'ExitChatHandler',
      createdAt: new Date(),
      id: 0,
    };
  }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [
      session_service_1.SessionService,
      core_1.ModuleRef,
    ]),
  ],
  BotService,
);
//# sourceMappingURL=bot.service.js.map
