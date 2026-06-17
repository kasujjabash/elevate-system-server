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
exports.RegisterController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const contacts_service_1 = require('../contacts.service');
const person_entity_1 = require('../entities/person.entity');
const typeorm_1 = require('typeorm');
const create_person_dto_1 = require('../dto/create-person.dto');
const user_entity_1 = require('../../users/entities/user.entity');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
const users_service_1 = require('../../users/users.service');
const public_decorator_1 = require('../../auth/decorators/public.decorator');
let RegisterController = class RegisterController {
  constructor(connection, service, userService) {
    this.service = service;
    this.userService = userService;
    this.personRepository = connection.getRepository(person_entity_1.default);
    this.userRepository = connection.getRepository(user_entity_1.User);
  }
  async create(data) {
    const _contact = await this.service.createPerson(data);
    const contact =
      await contacts_service_1.ContactsService.toListDto(_contact);
    await this.userService.createUser({
      contactId: contact.id,
      username: contact.email,
      password: '12345678',
      roles: ['DASHBOARD', 'USER_VIEW'],
      isActive: true,
    });
    return contact;
  }
};
exports.RegisterController = RegisterController;
__decorate(
  [
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [create_person_dto_1.CreatePersonDto]),
    __metadata('design:returntype', Promise),
  ],
  RegisterController.prototype,
  'create',
  null,
);
exports.RegisterController = RegisterController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiTags)('Register'),
    (0, common_1.Controller)('api/register'),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      contacts_service_1.ContactsService,
      users_service_1.UsersService,
    ]),
  ],
  RegisterController,
);
//# sourceMappingURL=register.controller.js.map
