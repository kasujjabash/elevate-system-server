import Contact from './contact.entity';
import { AddressCategory } from '../enums/addressCategory';
export default class Address {
  id: number;
  category: AddressCategory;
  isPrimary: boolean;
  country: string;
  district: string;
  freeForm?: string;
  latitude?: number;
  longitude?: number;
  geoCoordinates?: string;
  placeId?: string;
  contact: Contact;
  contactId: number;
}
