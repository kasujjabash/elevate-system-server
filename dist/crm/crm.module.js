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
Object.defineProperty(exports, '__esModule', { value: true });
exports.CrmModule = void 0;
const common_1 = require('@nestjs/common');
const axios_1 = require('@nestjs/axios');
const contacts_service_1 = require('./contacts.service');
const contacts_controller_1 = require('./contollers/contacts.controller');
const typeorm_1 = require('@nestjs/typeorm');
const nest_csv_parser_1 = require('nest-csv-parser');
const people_controller_1 = require('./contollers/people.controller');
const companies_controller_1 = require('./contollers/companies.controller');
const emails_controller_1 = require('./contollers/emails.controller');
const phones_controller_1 = require('./contollers/phones.controller');
const identifications_controller_1 = require('./contollers/identifications.controller');
const occasions_controller_1 = require('./contollers/occasions.controller');
const addresses_controller_1 = require('./contollers/addresses.controller');
const relationships_controller_1 = require('./contollers/relationships.controller');
const requests_controller_1 = require('./contollers/requests.controller');
const register_controller_1 = require('./contollers/register.controller');
const google_service_1 = require('../vendor/google.service');
const prisma_service_1 = require('../shared/prisma.service');
const contact_import_controller_1 = require('./contollers/contact-import.controller');
const group_finder_service_1 = require('./group-finder/group-finder.service');
const config_1 = require('../config');
const phones_service_1 = require('./phones.service');
const addresses_service_1 = require('./addresses.service');
const tenant_header_middleware_1 = require('../middleware/tenant-header.middleware');
const tenant_context_interceptor_1 = require('../interceptors/tenant-context.interceptor');
let CrmModule = class CrmModule {
  configure(consumer) {
    consumer
      .apply(tenant_header_middleware_1.TenantHeaderMiddleware)
      .forRoutes('api/register');
  }
};
exports.CrmModule = CrmModule;
exports.CrmModule = CrmModule = __decorate(
  [
    (0, common_1.Global)(),
    (0, common_1.Module)({
      imports: [
        nest_csv_parser_1.CsvModule,
        axios_1.HttpModule,
        typeorm_1.TypeOrmModule.forFeature(config_1.appEntities),
      ],
      providers: [
        contacts_service_1.ContactsService,
        google_service_1.GoogleService,
        prisma_service_1.PrismaService,
        group_finder_service_1.GroupFinderService,
        phones_service_1.PhonesService,
        addresses_service_1.AddressesService,
        tenant_context_interceptor_1.TenantContextInterceptor,
      ],
      controllers: [
        contacts_controller_1.ContactsController,
        people_controller_1.PeopleController,
        companies_controller_1.CompaniesController,
        emails_controller_1.EmailsController,
        phones_controller_1.PhonesController,
        identifications_controller_1.IdentificationsController,
        occasions_controller_1.OccasionsController,
        addresses_controller_1.AddressesController,
        relationships_controller_1.RelationshipsController,
        requests_controller_1.RequestsController,
        register_controller_1.RegisterController,
        contact_import_controller_1.ContactImportController,
      ],
      exports: [
        contacts_service_1.ContactsService,
        group_finder_service_1.GroupFinderService,
      ],
    }),
  ],
  CrmModule,
);
//# sourceMappingURL=crm.module.js.map
