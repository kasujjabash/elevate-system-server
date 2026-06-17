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
exports.AddressesService = void 0;
const common_1 = require('@nestjs/common');
const validation_1 = require('../utils/validation');
const google_service_1 = require('../vendor/google.service');
const typeorm_1 = require('typeorm');
const address_entity_1 = require('./entities/address.entity');
let AddressesService = class AddressesService {
  constructor(connection, googleService) {
    this.googleService = googleService;
    this.repository = connection.getRepository(address_entity_1.default);
  }
  async create(data) {
    let place;
    if ((0, validation_1.hasValue)(data.placeId)) {
      place = await this.googleService.getPlaceDetails(data.placeId);
    }
    const getIsPrimary = await this.repository.find({
      where: [{ contactId: data.contactId, isPrimary: true }],
    });
    if (data.isPrimary === true) {
      if (getIsPrimary.length > 0) {
        await getIsPrimary.map((it) => {
          const addresses = { ...it, isPrimary: false };
          this.repository.save(addresses);
        });
      }
    } else {
      if (getIsPrimary.length < 1) {
        data.isPrimary = true;
      } else if (getIsPrimary.length > 1) {
        await getIsPrimary.map((it) => {
          const addresses = { ...it, isPrimary: false };
          data.isPrimary = true;
          this.repository.save(addresses);
        });
      }
    }
    const newAddress = { ...data, ...place };
    return await this.repository.save(newAddress);
  }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONNECTION')),
    __metadata('design:paramtypes', [
      typeorm_1.Connection,
      google_service_1.GoogleService,
    ]),
  ],
  AddressesService,
);
//# sourceMappingURL=addresses.service.js.map
