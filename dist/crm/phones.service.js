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
exports.PhonesService = void 0;
const common_1 = require('@nestjs/common');
const phone_entity_1 = require('./entities/phone.entity');
const typeorm_1 = require('typeorm');
const phone_dto_1 = require('./dto/phone.dto');
let PhonesService = class PhonesService {
  constructor(connection) {
    this.repository = connection.getRepository(phone_entity_1.default);
  }
  async create(data) {
    const getIsPrimary = await this.repository.find({
      where: [{ contactId: data.contactId, isPrimary: true }],
    });
    if (data.isPrimary === true) {
      if (getIsPrimary.length > 0) {
        await getIsPrimary.map((it) => {
          const phones = { ...it, isPrimary: false };
          this.repository.save(phones);
        });
      }
    } else {
      if (getIsPrimary.length < 1) {
        data.isPrimary = true;
      } else if (getIsPrimary.length > 1) {
        await getIsPrimary.map((it) => {
          const phones = { ...it, isPrimary: false };
          data.isPrimary = true;
          this.repository.save(phones);
        });
      }
    }
    await this.repository.save(data);
    const getCurrentPhones = await this.repository.find({
      where: [{ contactId: data.contactId }],
    });
    return getCurrentPhones;
  }
};
exports.PhonesService = PhonesService;
__decorate(
  [
    __param(0, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [phone_dto_1.PhoneDto]),
    __metadata('design:returntype', Promise),
  ],
  PhonesService.prototype,
  'create',
  null,
);
exports.PhonesService = PhonesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [typeorm_1.Connection]),
  ],
  PhonesService,
);
//# sourceMappingURL=phones.service.js.map
