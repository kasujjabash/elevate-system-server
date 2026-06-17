import Contact from './contact.entity';
import { IdentificationCategory } from '../enums/identificationCategory';
export default class Identification {
  id: number;
  value: string;
  cardNumber?: string;
  issuingCountry: string;
  startDate: Date;
  expiryDate: Date;
  category: IdentificationCategory;
  isPrimary: boolean;
  contact: Contact;
  contactId: number;
}
