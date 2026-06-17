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
const contact_entity_1 = require('./contact.entity');
const identificationCategory_1 = require('../enums/identificationCategory');
let Identification = class Identification {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      value: { required: true, type: () => String },
      cardNumber: { required: false, type: () => String },
      issuingCountry: { required: true, type: () => String },
      startDate: { required: true, type: () => Date },
      expiryDate: { required: true, type: () => Date },
      category: {
        required: true,
        enum: require('../enums/identificationCategory').IdentificationCategory,
      },
      isPrimary: { required: true, type: () => Boolean },
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
  Identification.prototype,
  'id',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Identification.prototype,
  'value',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Identification.prototype,
  'cardNumber',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Identification.prototype,
  'issuingCountry',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Date)],
  Identification.prototype,
  'startDate',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Date)],
  Identification.prototype,
  'expiryDate',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: identificationCategory_1.IdentificationCategory,
      nullable: false,
      default: identificationCategory_1.IdentificationCategory.Nin,
    }),
    __metadata('design:type', String),
  ],
  Identification.prototype,
  'category',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Boolean)],
  Identification.prototype,
  'isPrimary',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.ManyToOne)(
      (type) => contact_entity_1.default,
      (it) => it.identifications,
      {
        onDelete: 'CASCADE',
      },
    ),
    __metadata('design:type', contact_entity_1.default),
  ],
  Identification.prototype,
  'contact',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  Identification.prototype,
  'contactId',
  void 0,
);
Identification = __decorate([(0, typeorm_1.Entity)()], Identification);
exports.default = Identification;
//# sourceMappingURL=identification.entity.js.map
