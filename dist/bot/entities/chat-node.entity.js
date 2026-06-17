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
exports.ChatNode = void 0;
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const ussd_response_dto_1 = require('../dto/ussd-response.dto');
const chat_session_entity_1 = require('./chat-session.entity');
let ChatNode = class ChatNode {
  toString() {
    return `ChatNode(name:${this.name}, input:${this.userInput})`;
  }
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      createdAt: { required: true, type: () => Date },
      name: { required: true, type: () => String },
      hasError: { required: true, type: () => Boolean },
      session: {
        required: false,
        type: () => require('./chat-session.entity').ChatSession,
      },
      sessionId: { required: true, type: () => Number },
      userInput: { required: true, type: () => String },
      nodeAction: {
        required: true,
        enum: require('../dto/ussd-response.dto').ChatAction,
      },
      message: { required: true, type: () => String },
      nextHandler: { required: true, type: () => String },
    };
  }
};
exports.ChatNode = ChatNode;
__decorate(
  [
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata('design:type', Number),
  ],
  ChatNode.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.CreateDateColumn)({
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata('design:type', Date),
  ],
  ChatNode.prototype,
  'createdAt',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ChatNode.prototype,
  'name',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Boolean)],
  ChatNode.prototype,
  'hasError',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.ManyToOne)(
      () => chat_session_entity_1.ChatSession,
      (it) => it.nodes,
    ),
    __metadata('design:type', chat_session_entity_1.ChatSession),
  ],
  ChatNode.prototype,
  'session',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  ChatNode.prototype,
  'sessionId',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ default: '' }), __metadata('design:type', String)],
  ChatNode.prototype,
  'userInput',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: ussd_response_dto_1.ChatAction,
      nullable: false,
      default: ussd_response_dto_1.ChatAction.End,
    }),
    __metadata('design:type', Number),
  ],
  ChatNode.prototype,
  'nodeAction',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ChatNode.prototype,
  'message',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ default: '' }), __metadata('design:type', String)],
  ChatNode.prototype,
  'nextHandler',
  void 0,
);
exports.ChatNode = ChatNode = __decorate([(0, typeorm_1.Entity)()], ChatNode);
//# sourceMappingURL=chat-node.entity.js.map
