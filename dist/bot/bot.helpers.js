'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.cleanUp = exports.chatHandlerProviders = exports.botEntities = void 0;
const chat_session_entity_1 = require('./entities/chat-session.entity');
const chat_node_entity_1 = require('./entities/chat-node.entity');
const welcome_handler_1 = require('./chat-flows/welcome-handler');
const handler_interface_1 = require('./chat-flows/handler-interface');
exports.botEntities = [
  chat_session_entity_1.ChatSession,
  chat_node_entity_1.ChatNode,
];
exports.chatHandlerProviders = [
  welcome_handler_1.WelcomeHandler,
  welcome_handler_1.WelcomeActionHandler,
  handler_interface_1.ExitChatHandler,
  welcome_handler_1.NameEnteredHandler,
  welcome_handler_1.AddressEnteredHandler,
];
function cleanUp(str) {
  return str.replace(/^[ \t]+/gm, '').trim();
}
exports.cleanUp = cleanUp;
//# sourceMappingURL=bot.helpers.js.map
