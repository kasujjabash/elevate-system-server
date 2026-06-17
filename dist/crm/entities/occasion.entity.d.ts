import Contact from './contact.entity';
import { OccasionCategory } from '../enums/occasionCategory';
export default class Occasion {
  id: number;
  value: Date;
  details: string;
  category: OccasionCategory;
  contact: Contact;
  contactId: number;
}
