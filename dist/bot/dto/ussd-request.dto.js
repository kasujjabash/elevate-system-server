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
exports.UssdRequestDto = void 0;
const openapi = require('@nestjs/swagger');
const class_validator_1 = require('class-validator');
class UssdRequestDto {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      sessionId: { required: true, type: () => String },
      serviceCode: { required: true, type: () => String },
      networkCode: { required: true, type: () => String },
      phoneNumber: { required: true, type: () => String },
      text: { required: true, type: () => String },
    };
  }
}
exports.UssdRequestDto = UssdRequestDto;
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  UssdRequestDto.prototype,
  'sessionId',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  UssdRequestDto.prototype,
  'serviceCode',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  UssdRequestDto.prototype,
  'networkCode',
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata('design:type', String)],
  UssdRequestDto.prototype,
  'phoneNumber',
  void 0,
);
//# sourceMappingURL=ussd-request.dto.js.map
