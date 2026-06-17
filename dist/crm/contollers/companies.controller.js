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
exports.CompaniesController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const contacts_service_1 = require('../contacts.service');
const typeorm_1 = require('typeorm');
const contact_search_dto_1 = require('../dto/contact-search.dto');
const validation_1 = require('../../utils/validation');
const create_company_dto_1 = require('../dto/create-company.dto');
const company_entity_1 = require('../entities/company.entity');
const jwt_auth_guard_1 = require('../../auth/guards/jwt-auth.guard');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
let CompaniesController = class CompaniesController {
  constructor(connection, service) {
    this.service = service;
    this.personRepository = connection.getRepository(company_entity_1.default);
  }
  async findAll(req) {
    const query = {};
    if ((0, validation_1.hasValue)(req.query)) {
      query.name = (0, typeorm_1.Like)(`${req.query}%`);
    }
    return await this.personRepository.find({
      where: query,
      skip: req.skip,
      take: req.limit,
    });
  }
  async findCombo(req) {
    const data = await this.personRepository.find({
      select: ['id', 'name'],
      skip: req.skip,
      take: req.limit,
    });
    return data.map((it) => ({
      id: it.id,
      name: it.name,
    }));
  }
  async create(data) {
    const contact = await this.service.createCompany(data);
    return contacts_service_1.ContactsService.toListDto(contact);
  }
  async update(data) {
    return await this.personRepository.save(data);
  }
};
exports.CompaniesController = CompaniesController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('../entities/company.entity').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_search_dto_1.ContactSearchDto]),
    __metadata('design:returntype', Promise),
  ],
  CompaniesController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Get)('combo'),
    openapi.ApiResponse({
      status: 200,
      type: [require('../dto/company-list.dto').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_search_dto_1.ContactSearchDto]),
    __metadata('design:returntype', Promise),
  ],
  CompaniesController.prototype,
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
    __metadata('design:paramtypes', [create_company_dto_1.CreateCompanyDto]),
    __metadata('design:returntype', Promise),
  ],
  CompaniesController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/company.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [company_entity_1.default]),
    __metadata('design:returntype', Promise),
  ],
  CompaniesController.prototype,
  'update',
  null,
);
exports.CompaniesController = CompaniesController = __decorate(
  [
    (0, common_1.UseInterceptors)(sentry_interceptor_1.SentryInterceptor),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Crm Companies'),
    (0, common_1.Controller)('api/crm/companies'),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      contacts_service_1.ContactsService,
    ]),
  ],
  CompaniesController,
);
//# sourceMappingURL=companies.controller.js.map
