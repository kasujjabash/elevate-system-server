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
var Contact_1;
Object.defineProperty(exports, '__esModule', { value: true });
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const person_entity_1 = require('./person.entity');
const company_entity_1 = require('./company.entity');
const email_entity_1 = require('./email.entity');
const request_entity_1 = require('./request.entity');
const phone_entity_1 = require('./phone.entity');
const occasion_entity_1 = require('./occasion.entity');
const address_entity_1 = require('./address.entity');
const identification_entity_1 = require('./identification.entity');
const contactCategory_1 = require('../enums/contactCategory');
const relationship_entity_1 = require('./relationship.entity');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
let Contact = (Contact_1 = class Contact {
  static ref(id) {
    const c = new Contact_1();
    c.id = id;
    return c;
  }
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      tenant: {
        required: true,
        type: () => require('../../tenants/entities/tenant.entity').Tenant,
      },
      category: {
        required: true,
        enum: require('../enums/contactCategory').ContactCategory,
      },
      person: {
        required: false,
        type: () => require('./person.entity').default,
      },
      company: {
        required: false,
        type: () => require('./company.entity').default,
      },
      emails: {
        required: true,
        type: () => [require('./email.entity').default],
      },
      phones: {
        required: true,
        type: () => [require('./phone.entity').default],
      },
      occasions: {
        required: true,
        type: () => [require('./occasion.entity').default],
      },
      addresses: {
        required: true,
        type: () => [require('./address.entity').default],
      },
      identifications: {
        required: true,
        type: () => [require('./identification.entity').default],
      },
      relationships: {
        required: true,
        type: () => [require('./relationship.entity').default],
      },
      requests: {
        required: true,
        type: () => [require('./request.entity').default],
      },
    };
  }
});
__decorate(
  [
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata('design:type', Number),
  ],
  Contact.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => tenant_entity_1.Tenant,
      (tenant) => tenant.contacts,
      { nullable: true },
    ),
    __metadata('design:type', tenant_entity_1.Tenant),
  ],
  Contact.prototype,
  'tenant',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: contactCategory_1.ContactCategory,
      nullable: false,
      default: contactCategory_1.ContactCategory.Person,
    }),
    __metadata('design:type', String),
  ],
  Contact.prototype,
  'category',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToOne)(
      (type) => person_entity_1.default,
      (it) => it.contact,
      {
        cascade: true,
        onDelete: 'CASCADE',
      },
    ),
    __metadata('design:type', person_entity_1.default),
  ],
  Contact.prototype,
  'person',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToOne)(
      (type) => person_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', company_entity_1.default),
  ],
  Contact.prototype,
  'company',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => email_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'emails',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => phone_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'phones',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => occasion_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'occasions',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => address_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'addresses',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => identification_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'identifications',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => relationship_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'relationships',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToMany)(
      (type) => request_entity_1.default,
      (it) => it.contact,
      { cascade: true },
    ),
    __metadata('design:type', Array),
  ],
  Contact.prototype,
  'requests',
  void 0,
);
Contact = Contact_1 = __decorate(
  [(0, typeorm_1.Entity)(), (0, typeorm_1.Index)(['tenant', 'id'])],
  Contact,
);
exports.default = Contact;
//# sourceMappingURL=contact.entity.js.map
