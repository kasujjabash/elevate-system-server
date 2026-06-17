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
const addressCategory_1 = require('../enums/addressCategory');
let Address = class Address {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      category: {
        required: true,
        enum: require('../enums/addressCategory').AddressCategory,
      },
      isPrimary: { required: true, type: () => Boolean },
      country: { required: true, type: () => String },
      district: { required: true, type: () => String },
      freeForm: { required: false, type: () => String },
      latitude: { required: false, type: () => Number },
      longitude: { required: false, type: () => Number },
      geoCoordinates: { required: false, type: () => String },
      placeId: { required: false, type: () => String },
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
  Address.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: addressCategory_1.AddressCategory,
      nullable: false,
      default: addressCategory_1.AddressCategory.Home,
    }),
    __metadata('design:type', String),
  ],
  Address.prototype,
  'category',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Boolean)],
  Address.prototype,
  'isPrimary',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Address.prototype,
  'country',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Address.prototype,
  'district',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Address.prototype,
  'freeForm',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata('design:type', Number),
  ],
  Address.prototype,
  'latitude',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata('design:type', Number),
  ],
  Address.prototype,
  'longitude',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'point', nullable: true }),
    __metadata('design:type', String),
  ],
  Address.prototype,
  'geoCoordinates',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata('design:type', String),
  ],
  Address.prototype,
  'placeId',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.ManyToOne)(
      (type) => contact_entity_1.default,
      (it) => it.addresses,
      {
        onDelete: 'CASCADE',
      },
    ),
    __metadata('design:type', contact_entity_1.default),
  ],
  Address.prototype,
  'contact',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  Address.prototype,
  'contactId',
  void 0,
);
Address = __decorate([(0, typeorm_1.Entity)()], Address);
exports.default = Address;
//# sourceMappingURL=address.entity.js.map
