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
exports.SessionService = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('typeorm');
const chat_session_entity_1 = require('./entities/chat-session.entity');
const chat_node_entity_1 = require('./entities/chat-node.entity');
const ussd_response_dto_1 = require('./dto/ussd-response.dto');
let SessionService = class SessionService {
  constructor(connection) {
    this.sessionRepository = connection.getRepository(
      chat_session_entity_1.ChatSession,
    );
    this.chatNodeRepository = connection.getRepository(
      chat_node_entity_1.ChatNode,
    );
  }
  async loadSession(request) {
    let session = await this.sessionRepository.findOne({
      where: [{ sessionId: request.sessionId, isActive: true }],
      relations: ['nodes'],
    });
    if (!session) {
      session = this.sessionRepository.create({
        phone: request.phoneNumber,
        sessionId: request.sessionId,
        userPath: `start=>${request.text}`,
        isActive: true,
        language: 'en',
        nodes: [],
        metaData: {},
      });
      await this.sessionRepository.save(session);
    }
    return session;
  }
  async createNode(node) {
    const newNode = this.chatNodeRepository.create(node);
    await this.chatNodeRepository.save(newNode);
    return newNode;
  }
  async updateSession(session, node) {
    const foundSession = await this.sessionRepository.findOne({
      where: { id: session.id },
    });
    if (!foundSession) {
      throw new Error(`Session not found ${session.id}`);
    }
    foundSession.metaData = session.metaData;
    foundSession.isActive =
      node.nodeAction === ussd_response_dto_1.ChatAction.Prompt;
    foundSession.userPath = `${session.userPath}=>${node.userInput}`;
    await this.sessionRepository.save(foundSession);
    const newNode = this.chatNodeRepository.create(node);
    await this.chatNodeRepository.save(newNode);
  }
  async popChatNode(session) {
    if (session.nodes.length === 1) {
      return session.nodes[0];
    }
    const poppedNode = session.nodes.pop();
    await this.chatNodeRepository.delete(poppedNode.id);
    session.userPath += `=>${session.userPath}`;
    await this.sessionRepository.save(session);
    return session.nodes[session.nodes.length - 1];
  }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  SessionService,
);
//# sourceMappingURL=session.service.js.map
