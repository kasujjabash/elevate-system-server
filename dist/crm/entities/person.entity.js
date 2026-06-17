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
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const salutation_1 = require('../enums/salutation');
const contact_entity_1 = require('./contact.entity');
const gender_1 = require('../enums/gender');
const civilStatus_1 = require('../enums/civilStatus');
let Person = class Person {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      salutation: {
        required: true,
        enum: require('../enums/salutation').Salutation,
      },
      firstName: { required: true, type: () => String },
      lastName: { required: true, type: () => String },
      middleName: { required: true, type: () => String },
      ageGroup: { required: true, type: () => String },
      placeOfWork: { required: true, type: () => String },
      gender: { required: true, enum: require('../enums/gender').Gender },
      civilStatus: {
        required: true,
        enum: require('../enums/civilStatus').CivilStatus,
      },
      avatar: { required: true, type: () => String },
      dateOfBirth: { required: true, type: () => Object },
      contact: {
        required: true,
        type: () => require('./contact.entity').default,
      },
      contactId: { required: true, type: () => Number },
    };
  }
};
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Person.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: salutation_1.Salutation,
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'salutation',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ length: 40 }), __metadata('design:type', String)],
  Person.prototype,
  'firstName',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ length: 40 }), __metadata('design:type', String)],
  Person.prototype,
  'lastName',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true, length: 40 }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'middleName',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'ageGroup',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'placeOfWork',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: gender_1.Gender,
      nullable: false,
    }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'gender',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: civilStatus_1.CivilStatus,
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'civilStatus',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Person.prototype,
  'avatar',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata('design:type', Object),
  ],
  Person.prototype,
  'dateOfBirth',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.OneToOne)(
      (type) => contact_entity_1.default,
      (it) => it.person,
      {
        onDelete: 'CASCADE',
      },
    ),
    (0, typeorm_1.JoinColumn)(),
    __metadata('design:type', contact_entity_1.default),
  ],
  Person.prototype,
  'contact',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  Person.prototype,
  'contactId',
  void 0,
);
Person = __decorate([(0, typeorm_1.Entity)()], Person);
exports.default = Person;
//# sourceMappingURL=person.entity.js.map
