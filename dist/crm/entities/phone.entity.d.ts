import Contact from './contact.entity';
import { PhoneCategory } from '../enums/phoneCategory';
export default class Phone {
  id: number;
  category: PhoneCategory;
  value: string;
  isPrimary: boolean;
  contact?: Contact;
  contactId: number;
}
