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
exports.ContactImportController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const nest_csv_parser_1 = require('nest-csv-parser');
const contacts_service_1 = require('../contacts.service');
const typeorm_1 = require('typeorm');
const company_entity_1 = require('../entities/company.entity');
const platform_express_1 = require('@nestjs/platform-express');
const jwt_auth_guard_1 = require('../../auth/guards/jwt-auth.guard');
const importUtils_1 = require('../utils/importUtils');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
const addressCategory_1 = require('../enums/addressCategory');
const users_service_1 = require('../../users/users.service');
const stringHelpers_1 = require('../../utils/stringHelpers');
const Duplex = require('stream').Duplex;
function bufferToStream(buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
class Entity {}
let ContactImportController = class ContactImportController {
  constructor(connection, service, csvParser, usersService) {
    this.service = service;
    this.csvParser = csvParser;
    this.usersService = usersService;
    this.companyRepository = connection.getRepository(company_entity_1.default);
  }
  async GetSample(res) {
    return res.sendFile('data.csv', { root: './public' });
  }
  async uploadFile(file) {
    const parsedData = await this.csvParser.parse(
      bufferToStream(file.buffer),
      Entity,
      null,
      null,
      { strict: true, separator: ',' },
    );
    const { list } = parsedData;
    const created = [];
    const notCreated = [];
    for (const [index, uploadedContact] of list.entries()) {
      try {
        const contactModel = (0, importUtils_1.parseContact)(uploadedContact);
        if (contactModel) {
          contactModel['residence'] = {
            category: addressCategory_1.AddressCategory.Home,
            isPrimary: true,
            country: uploadedContact.country,
            district: uploadedContact.district,
            freeForm: uploadedContact.address,
          };
          const newPerson = await this.service.createPerson(contactModel);
          created.push(newPerson);
        }
      } catch (err) {
        notCreated.push(uploadedContact);
        const userErrorMessage = `Contact ${uploadedContact.name} at position ${
          index + 1
        } out of ${list.length - 1} contacts not created. Error message: ${
          err.message
        }`;
        common_1.Logger.error(userErrorMessage);
        throw new common_1.BadRequestException({
          message: `${userErrorMessage}. Every contact from this one onwards has not been created. Fix this error, remove the contacts before this one and re-upload.`,
        });
      }
    }
    return created.map((it) => it.id);
  }
  async uploadGroupLeaders(file) {
    const parsedData = await this.csvParser.parse(
      bufferToStream(file.buffer),
      Entity,
      null,
      null,
      { strict: true, separator: ',' },
    );
    const { list } = parsedData;
    const created = [];
    const notCreated = [];
    for (const [index, uploadedContact] of list.entries()) {
      try {
        const contactModel = (0, importUtils_1.parseContact)(uploadedContact);
        if (contactModel) {
          contactModel['residence'] = {
            category: addressCategory_1.AddressCategory.Home,
            isPrimary: true,
            country: uploadedContact.country,
            district: uploadedContact.district,
            freeForm: uploadedContact.address,
          };
          const newPerson = await this.service.createPerson(contactModel);
          created.push(newPerson);
          const newUserObj = {
            contactId: newPerson.id,
            username: uploadedContact.email,
            password: (0, stringHelpers_1.generateRandomPassword)(8),
            roles: [],
            isActive: true,
          };
          const newUser = await this.usersService.createUser(newUserObj);
        }
      } catch (err) {
        notCreated.push(uploadedContact);
        const userErrorMessage = `Contact ${uploadedContact.name} at position ${
          index + 1
        } out of ${list.length - 1} contacts not created. Error message: ${
          err.message
        }`;
        common_1.Logger.error(userErrorMessage);
        throw new common_1.BadRequestException({
          message: `${userErrorMessage}. Every contact from this one onwards has not been created. Fix this error, remove the contacts before this one and re-upload.`,
        });
      }
    }
    return created.map((it) => it.id);
  }
};
exports.ContactImportController = ContactImportController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('../dto/company-list.dto').default],
    }),
    __param(0, (0, common_1.Res)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ContactImportController.prototype,
  'GetSample',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(
      (0, platform_express_1.FileInterceptor)('file'),
    ),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ContactImportController.prototype,
  'uploadFile',
  null,
);
__decorate(
  [
    (0, common_1.Post)('groupLeaders'),
    (0, common_1.UseInterceptors)(
      (0, platform_express_1.FileInterceptor)('file'),
    ),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  ContactImportController.prototype,
  'uploadGroupLeaders',
  null,
);
exports.ContactImportController = ContactImportController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Crm Contacts'),
    (0, common_1.Controller)('api/crm/import'),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      contacts_service_1.ContactsService,
      nest_csv_parser_1.CsvParser,
      users_service_1.UsersService,
    ]),
  ],
  ContactImportController,
);
//# sourceMappingURL=contact-import.controller.js.map
