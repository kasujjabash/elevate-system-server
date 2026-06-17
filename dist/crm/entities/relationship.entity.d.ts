import Contact from './contact.entity';
import { RelationshipCategory } from '../enums/relationshipCategory';
export default class Relationship {
  id: number;
  category: RelationshipCategory;
  contact: Contact;
  contactId: number;
  relative: Contact;
  relativeId: number;
}
