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
exports.ChatService = void 0;
const common_1 = require('@nestjs/common');
const email_entity_1 = require('../crm/entities/email.entity');
const mailer_1 = require('../utils/mailer');
const typeorm_1 = require('typeorm');
let ChatService = class ChatService {
  constructor(connection) {
    this.emailRepository = connection.getRepository(email_entity_1.default);
  }
  async mailAll(data) {
    try {
      for (let i = 0; i < data.recipientId.length; i++) {
        const mailAddress = await this.emailRepository.find({
          select: ['value'],
          where: [{ contactId: data.recipientId[i] }],
        });
        this.sendMailToMember(mailAddress[0].value, data.subject, data.body);
      }
    } catch (error) {
      common_1.Logger.log(error);
    }
  }
  async sendMailToMember(to, subject, body) {
    try {
      const mailerData = {
        to: `${to}`,
        subject: `${subject}`,
        html: `<p> ${body} </p>`,
      };
      await (0, mailer_1.sendEmail)(mailerData);
      common_1.Logger.log('Email sent successfully.');
    } catch (error) {
      common_1.Logger.log(error);
    }
  }
  findAll() {
    return 'This action returns all chat';
  }
  findOne(id) {
    return `This action returns a #${id} chat`;
  }
  update(id, updateChatDto) {
    return `This action updates a #${id} chat`;
  }
  remove(id) {
    return `This action removes a #${id} chat`;
  }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  ChatService,
);
//# sourceMappingURL=chat.service.js.map
