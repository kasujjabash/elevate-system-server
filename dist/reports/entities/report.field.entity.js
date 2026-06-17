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
exports.ReportField = exports.FieldType = void 0;
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const report_entity_1 = require('./report.entity');
var FieldType;
(function (FieldType) {
  FieldType['TEXT'] = 'text';
  FieldType['TEXTAREA'] = 'textarea';
  FieldType['NUMBER'] = 'number';
  FieldType['DATE'] = 'date';
  FieldType['DATETIME'] = 'datetime';
  FieldType['SELECT'] = 'select';
})(FieldType || (exports.FieldType = FieldType = {}));
let ReportField = class ReportField {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      report: { required: true, type: () => require('./report.entity').Report },
      name: { required: true, type: () => String },
      type: {
        required: true,
        enum: require('./report.field.entity').FieldType,
      },
      label: { required: true, type: () => String },
      required: { required: true, type: () => Boolean },
      hidden: { required: true, type: () => Boolean },
      options: { required: true, type: () => [Object] },
    };
  }
};
exports.ReportField = ReportField;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  ReportField.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => report_entity_1.Report,
      (report) => report.fields,
    ),
    __metadata('design:type', report_entity_1.Report),
  ],
  ReportField.prototype,
  'report',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ReportField.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: FieldType,
      default: FieldType.TEXT,
    }),
    __metadata('design:type', String),
  ],
  ReportField.prototype,
  'type',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', String)],
  ReportField.prototype,
  'label',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ default: false }),
    __metadata('design:type', Boolean),
  ],
  ReportField.prototype,
  'required',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ default: false }),
    __metadata('design:type', Boolean),
  ],
  ReportField.prototype,
  'hidden',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata('design:type', Array),
  ],
  ReportField.prototype,
  'options',
  void 0,
);
exports.ReportField = ReportField = __decorate(
  [(0, typeorm_1.Entity)()],
  ReportField,
);
//# sourceMappingURL=report.field.entity.js.map
