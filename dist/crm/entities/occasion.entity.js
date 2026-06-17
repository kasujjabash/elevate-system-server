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
const occasionCategory_1 = require('../enums/occasionCategory');
let Occasion = class Occasion {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      value: { required: true, type: () => Date },
      details: { required: true, type: () => String },
      category: {
        required: true,
        enum: require('../enums/occasionCategory').OccasionCategory,
      },
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
  Occasion.prototype,
  'id',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Date)],
  Occasion.prototype,
  'value',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  Occasion.prototype,
  'details',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: occasionCategory_1.OccasionCategory,
      nullable: false,
      default: occasionCategory_1.OccasionCategory.Birthday,
    }),
    __metadata('design:type', String),
  ],
  Occasion.prototype,
  'category',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.ManyToOne)(
      (type) => contact_entity_1.default,
      (it) => it.occasions,
      {
        onDelete: 'CASCADE',
      },
    ),
    __metadata('design:type', contact_entity_1.default),
  ],
  Occasion.prototype,
  'contact',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  Occasion.prototype,
  'contactId',
  void 0,
);
Occasion = __decorate([(0, typeorm_1.Entity)()], Occasion);
exports.default = Occasion;
//# sourceMappingURL=occasion.entity.js.map
