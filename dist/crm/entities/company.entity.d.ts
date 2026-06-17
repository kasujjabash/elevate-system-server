import Contact from './contact.entity';
export default class Company {
  id: number;
  name: string;
  contact?: Contact;
  contactId: number;
}
