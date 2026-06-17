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
exports.GoogleService = void 0;
const common_1 = require('@nestjs/common');
const axios_1 = require('@nestjs/axios');
const client_friendly_exception_1 = require('../shared/exceptions/client-friendly.exception');
let GoogleService = class GoogleService {
  constructor(httpService) {
    this.httpService = httpService;
  }
  async getPlaceDetails(placeId) {
    const url = process.env.MAPS_URL;
    const key = process.env.MAPS_KEY;
    common_1.Logger.log(
      `Google.PlaceDetails placeId: ${placeId} start request`,
    );
    const data = await this.httpService
      .get(`${url}`, {
        params: {
          key,
          ['place_id']: placeId,
        },
      })
      .toPromise();
    const response = data.data;
    if (response.status !== 'OK')
      throw new client_friendly_exception_1.default(response['error_message']);
    common_1.Logger.log(`Google.PlaceDetails placeId: ${placeId} got response`);
    const {
      geometry: { location },
      name,
      formatted_address: addressParts,
      vicinity,
    } = response.result;
    const parts = addressParts
      .split(',')
      .map((it) => it.trim())
      .reverse();
    const [country, ...rest] = parts;
    return {
      placeId,
      latitude: location.lat,
      longitude: location.lng,
      name,
      vicinity,
      country,
      district: rest.join(', '),
    };
  }
};
exports.GoogleService = GoogleService;
exports.GoogleService = GoogleService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [axios_1.HttpService]),
  ],
  GoogleService,
);
//# sourceMappingURL=google.service.js.map
