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
exports.ContactsController = void 0;
const openapi = require('@nestjs/swagger');
const common_1 = require('@nestjs/common');
const contacts_service_1 = require('../contacts.service');
const contact_search_dto_1 = require('../dto/contact-search.dto');
const contact_entity_1 = require('../entities/contact.entity');
const swagger_1 = require('@nestjs/swagger');
const sentry_interceptor_1 = require('../../utils/sentry.interceptor');
const tenant_context_interceptor_1 = require('../../interceptors/tenant-context.interceptor');
let ContactsController = class ContactsController {
  constructor(service) {
    this.service = service;
  }
  async findAll(req) {
    return this.service.findAll(req);
  }
  async create(data, req) {
    return await this.service.create(data, req);
  }
  async updateLegacy(data) {
    return await this.service.update(data);
  }
  async update(id, data) {
    return await this.service.updatePartial(id, data);
  }
  async findOne(id) {
    return await this.service.findOne(id);
  }
  async remove(id) {
    await this.service.remove(id);
  }
};
exports.ContactsController = ContactsController;
__decorate(
  [
    (0, common_1.Get)(),
    openapi.ApiResponse({
      status: 200,
      type: [require('../dto/contact-list.dto').default],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_search_dto_1.ContactSearchDto]),
    __metadata('design:returntype', Promise),
  ],
  ContactsController.prototype,
  'findAll',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    openapi.ApiResponse({
      status: 201,
      type: require('../entities/contact.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_entity_1.default, Object]),
    __metadata('design:returntype', Promise),
  ],
  ContactsController.prototype,
  'create',
  null,
);
__decorate(
  [
    (0, common_1.Put)(),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/contact.entity').default,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [contact_entity_1.default]),
    __metadata('design:returntype', Promise),
  ],
  ContactsController.prototype,
  'updateLegacy',
  null,
);
__decorate(
  [
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/contact.entity').default,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number, Object]),
    __metadata('design:returntype', Promise),
  ],
  ContactsController.prototype,
  'update',
  null,
);
__decorate(
  [
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({
      status: 200,
      type: require('../entities/contact.entity').default,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  ContactsController.prototype,
  'findOne',
  null,
);
__decorate(
  [
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise),
  ],
  ContactsController.prototype,
  'remove',
  null,
);
exports.ContactsController = ContactsController = __decorate(
  [
    (0, common_1.UseInterceptors)(
      sentry_interceptor_1.SentryInterceptor,
      tenant_context_interceptor_1.TenantContextInterceptor,
    ),
    (0, swagger_1.ApiTags)('Crm'),
    (0, common_1.Controller)('api/crm/contacts'),
    __metadata('design:paramtypes', [contacts_service_1.ContactsService]),
  ],
  ContactsController,
);
//# sourceMappingURL=contacts.controller.js.map
