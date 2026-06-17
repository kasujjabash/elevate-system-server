import { Point } from '../../utils/locationHelpers';
export default class InternalAddress {
  country: string;
  district: string;
  placeId: string;
  name: string;
  latitude: number;
  longitude: number;
  geoCoordinates?: Point | string;
  vicinity: string;
}
