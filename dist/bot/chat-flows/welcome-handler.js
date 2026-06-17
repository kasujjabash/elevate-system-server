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
exports.AddressEnteredHandler =
  exports.NameEnteredHandler =
  exports.WelcomeActionHandler =
  exports.WelcomeHandler =
    void 0;
const handler_interface_1 = require('./handler-interface');
const ussd_response_dto_1 = require('../dto/ussd-response.dto');
const common_1 = require('@nestjs/common');
const date_fns_1 = require('date-fns');
const google_sheets_service_1 = require('../google-sheets.service');
const fieldNames = {
  name: 'name',
  address: 'address',
  phoneNumber: 'phoneNumber',
};
let WelcomeHandler = class WelcomeHandler {
  constructor() {
    this.message = `
  Welcome to Worship harvest.
  1. I've just gotten saved
  2. I want to join an MC
  `;
  }
  async execute(userInput, session) {
    const node = (0, handler_interface_1.createNode)(session, {
      nodeAction: ussd_response_dto_1.ChatAction.Prompt,
      userInput: userInput,
      message: this.message,
      nextHandler: WelcomeActionHandler.name,
    });
    session.metaData = {
      ...session.metaData,
      [fieldNames.phoneNumber]: session.phone,
    };
    return Promise.resolve(node);
  }
};
exports.WelcomeHandler = WelcomeHandler;
exports.WelcomeHandler = WelcomeHandler = __decorate(
  [(0, common_1.Injectable)()],
  WelcomeHandler,
);
let WelcomeActionHandler = class WelcomeActionHandler {
  async execute(userInput, session) {
    let nextHandler;
    let action = ussd_response_dto_1.ChatAction.Prompt;
    let message = '';
    switch (userInput) {
      case '1':
        nextHandler = NameEnteredHandler.name;
        message = 'What is your full name?';
        break;
      case '2':
        action = ussd_response_dto_1.ChatAction.End;
        nextHandler = '';
        message = handler_interface_1.chatStrings.comingSoon;
        break;
      default:
        nextHandler = null;
        break;
    }
    if (nextHandler === null) {
      return session.nodes[session.nodes.length - 1];
    }
    const node = (0, handler_interface_1.createNode)(session, {
      nodeAction: action,
      userInput: userInput,
      message: message,
      nextHandler: nextHandler,
    });
    return Promise.resolve(node);
  }
};
exports.WelcomeActionHandler = WelcomeActionHandler;
exports.WelcomeActionHandler = WelcomeActionHandler = __decorate(
  [(0, common_1.Injectable)()],
  WelcomeActionHandler,
);
let NameEnteredHandler = class NameEnteredHandler {
  async execute(userInput, session) {
    const nameIsValid = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(
      userInput,
    );
    if (nameIsValid) {
      session.metaData = { ...session.metaData, [fieldNames.name]: userInput };
      const node = (0, handler_interface_1.createNode)(session, {
        nodeAction: ussd_response_dto_1.ChatAction.Prompt,
        userInput: userInput,
        message: `
        Where do you stay?
        `,
        nextHandler: AddressEnteredHandler.name,
      });
      return Promise.resolve(node);
    } else {
      const node = session.nodes[session.nodes.length - 1];
      node.hasError = true;
      return Promise.resolve(node);
    }
  }
};
exports.NameEnteredHandler = NameEnteredHandler;
exports.NameEnteredHandler = NameEnteredHandler = __decorate(
  [(0, common_1.Injectable)()],
  NameEnteredHandler,
);
let AddressEnteredHandler = class AddressEnteredHandler {
  constructor(sheetsService) {
    this.sheetsService = sheetsService;
  }
  async execute(userInput, session) {
    const addressIsValid = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(
      userInput,
    );
    if (addressIsValid) {
      session.metaData = {
        ...session.metaData,
        [fieldNames.address]: userInput,
      };
      await this.submitToGoogleSheet(session);
      const node = (0, handler_interface_1.createNode)(session, {
        nodeAction: ussd_response_dto_1.ChatAction.End,
        userInput: userInput,
        message: `
        Thank you for contacting us. We will call you shortly.
        `,
        nextHandler: '',
      });
      return Promise.resolve(node);
    } else {
      const node = session.nodes[session.nodes.length - 1];
      node.hasError = true;
      return Promise.resolve(node);
    }
  }
  async submitToGoogleSheet(session) {
    const { name, address, phoneNumber } = session.metaData;
    const event = '-NA-';
    const date = (0, date_fns_1.format)(new Date(), 'dd/MM/yyyy');
    this.sheetsService
      .addRowToSheet([[name, date, event, phoneNumber, address]])
      .then(() => {
        console.log('Successfully added row to sheet');
      });
    return await Promise.resolve();
  }
};
exports.AddressEnteredHandler = AddressEnteredHandler;
exports.AddressEnteredHandler = AddressEnteredHandler = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [
      google_sheets_service_1.GoogleSheetsService,
    ]),
  ],
  AddressEnteredHandler,
);
//# sourceMappingURL=welcome-handler.js.map
