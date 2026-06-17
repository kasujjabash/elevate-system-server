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
exports.ChatController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const jwt_auth_guard_1 = require('../auth/guards/jwt-auth.guard');
const sentry_interceptor_1 = require('../utils/sentry.interceptor');
const chat_service_1 = require('./chat.service');
const chat_rooms_service_1 = require('./chat-rooms.service');
const sendMail_dto_1 = require('./dto/sendMail.dto');
const update_chat_dto_1 = require('./dto/update-chat.dto');
let ChatController = class ChatController {
  constructor(chatService, chatRoomsService) {
    this.chatService = chatService;
    this.chatRoomsService = chatRoomsService;
  }
  getRooms(req) {
    return this.chatRoomsService.getRooms(req.user.id);
  }
  createRoom(req, body) {
    return this.chatRoomsService.createRoom(req.user.id, body);
  }
  getMessages(id, req) {
    return this.chatRoomsService.getMessages(id, req.user.id);
  }
  sendMessage(id, req, content) {
    return this.chatRoomsService.sendMessage(id, req.user.id, content);
  }
  getContacts(req) {
    return this.chatRoomsService.getContacts(req.user.id, req.user.roles ?? []);
  }
  sendEmail(createEmailDto) {
    return this.chatService.mailAll(createEmailDto);
  }
  findAll() {
    return this.chatService.findAll();
  }
  findOne(id) {
    return this.chatService.findOne(+id);
  }
  update(id, updateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }
  remove(id) {
    return this.chatService.remove(+id);
  }
};
exports.ChatController = ChatController;
__decorate(
  [
    (0, common_1.Get)('rooms'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'getRooms',
  null,
);
__decorate(
  [
    (0, common_1.Post)('rooms'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'createRoom',
  null,
);
__decorate(
  [
    (0, common_1.Get)('rooms/:id/messages'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'getMessages',
  null,
);
__decorate(
  [
    (0, common_1.Post)('rooms/:id/messages'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('content')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object, String]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'sendMessage',
  null,
);
__decorate(
  [
    (0, common_1.Get)('contacts'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'getContacts',
  null,
);
__decorate(
  [
    (0, common_1.Post)('/email'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [sendMail_dto_1.default]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'sendEmail',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String, update_chat_dto_1.UpdateChatDto]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', void 0),
  ],
  ChatController.prototype,
  'remove',
  null,
);
exports.ChatController = ChatController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/chat'),
    __metadata('design:paramtypes', [
      chat_service_1.ChatService,
      chat_rooms_service_1.ChatRoomsService,
    ]),
  ],
  ChatController,
);
//# sourceMappingURL=chat.controller.js.map
