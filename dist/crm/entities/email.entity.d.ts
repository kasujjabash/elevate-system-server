import Contact from './contact.entity';
import { EmailCategory } from '../enums/emailCategory';
export default class Email {
  id: number;
  category: EmailCategory;
  value: string;
  isPrimary: boolean;
  contact?: Contact;
  contactId: number;
}
