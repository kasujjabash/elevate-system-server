import Contact from './contact.entity';
import { OccasionCategory } from '../enums/occasionCategory';
export default class Request {
  id: number;
  value: Date;
  details: string;
  category: OccasionCategory;
  contact: Contact;
  relativeId: number;
}
