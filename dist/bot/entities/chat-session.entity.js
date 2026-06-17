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
exports.ChatSession = void 0;
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const chat_node_entity_1 = require('./chat-node.entity');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
let ChatSession = class ChatSession {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      tenant: {
        required: true,
        type: () => require('../../tenants/entities/tenant.entity').Tenant,
      },
      createdAt: { required: true, type: () => Date },
      phone: { required: true, type: () => String },
      userPath: { required: true, type: () => String },
      language: { required: true, type: () => String },
      isActive: { required: true, type: () => Boolean },
      sessionId: { required: true, type: () => String },
      nodes: {
        required: true,
        type: () => [require('./chat-node.entity').ChatNode],
      },
      metaData: { required: true, type: () => Object },
    };
  }
};
exports.ChatSession = ChatSession;
__decorate(
  [
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata('design:type', Number),
  ],
  ChatSession.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => tenant_entity_1.Tenant,
      (tenant) => tenant.chatSessions,
      { nullable: false },
    ),
    __metadata('design:type', tenant_entity_1.Tenant),
  ],
  ChatSession.prototype,
  'tenant',
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
  ChatSession.prototype,
  'createdAt',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ChatSession.prototype,
  'phone',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ default: '' }), __metadata('design:type', String)],
  ChatSession.prototype,
  'userPath',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ChatSession.prototype,
  'language',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Boolean)],
  ChatSession.prototype,
  'isActive',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ChatSession.prototype,
  'sessionId',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      () => chat_node_entity_1.ChatNode,
      (it) => it.session,
    ),
    __metadata('design:type', Array),
  ],
  ChatSession.prototype,
  'nodes',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)('json', { default: {} }),
    __metadata('design:type', Object),
  ],
  ChatSession.prototype,
  'metaData',
  void 0,
);
exports.ChatSession = ChatSession = __decorate(
  [(0, typeorm_1.Entity)(), (0, typeorm_1.Index)(['tenant', 'id'])],
  ChatSession,
);
//# sourceMappingURL=chat-session.entity.js.map
