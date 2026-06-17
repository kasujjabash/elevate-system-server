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
const phoneCategory_1 = require('../enums/phoneCategory');
let Phone = class Phone {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      category: {
        required: true,
        enum: require('../enums/phoneCategory').PhoneCategory,
      },
      value: { required: true, type: () => String },
      isPrimary: { required: true, type: () => Boolean },
      contact: {
        required: false,
        type: () => require('./contact.entity').default,
      },
      contactId: { required: true, type: () => Number },
    };
  }
};
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Phone.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: phoneCategory_1.PhoneCategory,
      nullable: false,
      default: phoneCategory_1.PhoneCategory.Mobile,
    }),
    __metadata('design:type', String),
  ],
  Phone.prototype,
  'category',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Phone.prototype,
  'value',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Boolean)],
  Phone.prototype,
  'isPrimary',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.ManyToOne)(
      (type) => contact_entity_1.default,
      (it) => it.phones,
      {
        onDelete: 'CASCADE',
      },
    ),
    __metadata('design:type', contact_entity_1.default),
  ],
  Phone.prototype,
  'contact',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  Phone.prototype,
  'contactId',
  void 0,
);
Phone = __decorate([(0, typeorm_1.Entity)()], Phone);
exports.default = Phone;
//# sourceMappingURL=phone.entity.js.map
