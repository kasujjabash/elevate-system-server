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
const URLCategory_1 = require('../enums/URLCategory');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
let Help = class Help {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      tenant: {
        required: true,
        type: () => require('../../tenants/entities/tenant.entity').Tenant,
      },
      title: { required: true, type: () => String },
      url: { required: false, type: () => String },
      category: {
        required: true,
        enum: require('../enums/URLCategory').URLCategory,
      },
      createdOn: { required: true, type: () => Date },
      modifiedOn: { required: true, type: () => Date },
    };
  }
};
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Help.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => tenant_entity_1.Tenant,
      (tenant) => tenant.helpArticles,
      { nullable: true },
    ),
    __metadata('design:type', tenant_entity_1.Tenant),
  ],
  Help.prototype,
  'tenant',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ length: 300 }), __metadata('design:type', String)],
  Help.prototype,
  'title',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata('design:type', String),
  ],
  Help.prototype,
  'url',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: URLCategory_1.URLCategory,
      nullable: true,
    }),
    __metadata('design:type', String),
  ],
  Help.prototype,
  'category',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.CreateDateColumn)({
      default: () => 'NOW()',
      nullable: false,
    }),
    __metadata('design:type', Date),
  ],
  Help.prototype,
  'createdOn',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.UpdateDateColumn)({
      default: () => 'NOW()',
      nullable: false,
    }),
    __metadata('design:type', Date),
  ],
  Help.prototype,
  'modifiedOn',
  void 0,
);
Help = __decorate(
  [
    (0, typeorm_1.Entity)({ name: 'help' }),
    (0, typeorm_1.Index)(['tenant', 'id']),
  ],
  Help,
);
exports.default = Help;
//# sourceMappingURL=help.entity.js.map
