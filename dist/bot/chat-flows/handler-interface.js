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
exports.chatStrings = exports.ExitChatHandler = exports.createNode = void 0;
const ussd_response_dto_1 = require('../dto/ussd-response.dto');
const common_1 = require('@nestjs/common');
const bot_helpers_1 = require('../bot.helpers');
class ChatNodeCreateModel {}
const createNode = (session, model) => {
  return {
    id: 0,
    createdAt: new Date(),
    message: (0, bot_helpers_1.cleanUp)(model.message),
    nodeAction: model.nodeAction,
    nextHandler: model.nextHandler,
    name: model.name || 'chat-node',
    userInput: model.userInput,
    hasError: model.hasError || false,
    sessionId: session.id,
  };
};
exports.createNode = createNode;
let ExitChatHandler = class ExitChatHandler {
  async execute(userInput, session) {
    const node = (0, exports.createNode)(session, {
      nodeAction: ussd_response_dto_1.ChatAction.End,
      userInput: userInput,
      message: 'Thank you for using our service.',
      nextHandler: '',
    });
    return Promise.resolve(node);
  }
};
exports.ExitChatHandler = ExitChatHandler;
exports.ExitChatHandler = ExitChatHandler = __decorate(
  [(0, common_1.Injectable)()],
  ExitChatHandler,
);
exports.chatStrings = {
  comingSoon: 'This feature is coming soon.\n Thank you for using our service.',
  invalidInput: 'Invalid input. Please try again.',
};
//# sourceMappingURL=handler-interface.js.map
