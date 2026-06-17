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
exports.PeopleController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const contacts_service_1 = require('../contacts.service');
const person_entity_1 = require('../entities/person.entity');
const typeorm_1 = require('typeorm');
const contact_search_dto_1 = require('../dto/contact-search.dto');
const create_person_dto_1 = require('../dto/create-person.dto');
const crm_helpers_1 = require('../crm.helpers');
const validation_1 = require('../../utils/validation');
const platform_express_1 = require('@nestjs/platform-express');
const jwt_auth_guard_1 = require('../../auth/guards/jwt-auth.guard');
const user_entity_1 = require('../../users/entities/user.entity');
const person_edit_dto_1 = require('../dto/person-edit.dto');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
let PeopleController = class PeopleController {
  constructor(connection, service) {
    this.service = service;
    this.personRepository = connection.getRepository(person_entity_1.default);
    this.userRepository = connection.getRepository(user_entity_1.User);
  }
  async findAll(req) {
    const query = this.personRepository.createQueryBuilder('person');
    if ((0, validation_1.hasValue)(req.query)) {
      query.where(
        new typeorm_1.Brackets((qb) => {
          qb.where('person.firstName LIKE :query', { query: `%${req.query}%` });
          qb.orWhere('person.middleName LIKE :query', {
            query: `%${req.query}%`,
          });
          qb.orWhere('person.lastName LIKE :query', {
            query: `%${req.query}%`,
          });
        }),
      );
    }
    query.skip(req.skip).take(req.limit);
    return await query.getMany();
  }
  async findCombo(req) {
    const query = this.personRepository.createQueryBuilder('person');
    if ((0, validation_1.hasValue)(req.query)) {
      query
        .select([
          'person.id',
          'person.firstName',
          'person.lastName',
          'person.middleName',
          'person.avatar',
          'person.contactId',
        ])
        .where(
          new typeorm_1.Brackets((qb) => {
            qb.where('person.firstName LIKE :query', {
              query: `%${req.query}%`,
            });
            qb.orWhere('person.middleName LIKE :query', {
              query: `%${req.query}%`,
            });
            qb.orWhere('person.lastName LIKE :query', {
              query: `%${req.query}%`,
            });
          }),
        );
    }
    query.skip(req.skip).take(req.limit);
    let data = await query.getMany();
    if (req.skipUsers) {
      const users = await this.userRepository.find({
        where: {},
        select: ['contactId'],
      });
      const idList = users.map((it) => it.contactId);
      data = data.filter((it) => idList.indexOf(it.contactId) < 0);
    }
    return data.map((it) => ({
      id: it.contactId,
      name: (0, crm_helpers_1.getPersonFullName)(it),
      avatar: it.avatar,
    }));
  }
  async create(data) {
    const created = await this.service.createPerson(data);
    const contact = await this.service.findOne(created.id);
    return contacts_service_1.ContactsService.toListDto(contact);
  }
  async upload(file) {
    console.log(file);
  }
  async update({ id, ...data }) {
    await this.personRepository
      .createQueryBuilder()
      .update()
      .set({
        ...data,
      })
      .where('id = :id', { id })
      .execute();
    return await this.personRepository.findOne({ where: { id } });
  }
};
exports.PeopleController = PeopleController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('../entities/person.entity').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_search_dto_1.ContactSearchDto]),
    __metadata('design:returntype', Promise),
  ],
  PeopleController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)('combo'),
    openapi.ApiResponse({
      status: 200,
      type: [require('../dto/person-list.dto').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_search_dto_1.ContactSearchDto]),
    __metadata('design:returntype', Promise),
  ],
  PeopleController.prototype,
  'findCombo',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: require('../dto/contact-list.dto').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [create_person_dto_1.CreatePersonDto]),
    __metadata('design:returntype', Promise),
  ],
  PeopleController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)(
      (0, platform_express_1.FileInterceptor)('file'),
    ),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  PeopleController.prototype,
  'upload',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/person.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [person_edit_dto_1.PersonEditDto]),
    __metadata('design:returntype', Promise),
  ],
  PeopleController.prototype,
  'update',
  null,
);
exports.PeopleController = PeopleController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, swagger_1.ApiTags)('Crm People'),
    (0, common_1.Controller)('api/crm/people'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      contacts_service_1.ContactsService,
    ]),
  ],
  PeopleController,
);
//# sourceMappingURL=people.controller.js.map
