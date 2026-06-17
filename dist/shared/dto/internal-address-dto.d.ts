import { Point } from '../../utils/locationHelpers';
export default class InternalAddressDto {
  country: string;
  district: string;
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  vicinity: string;
  geoCoordinates?: Point | string;
}
