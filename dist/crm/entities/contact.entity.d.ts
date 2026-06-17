import Person from './person.entity';
import Company from './company.entity';
import Email from './email.entity';
import Request from './request.entity';
import Phone from './phone.entity';
import Occasion from './occasion.entity';
import Address from './address.entity';
import Identification from './identification.entity';
import { ContactCategory } from '../enums/contactCategory';
import Relationship from './relationship.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
export default class Contact {
  id: number;
  tenant: Tenant;
  category: ContactCategory;
  person?: Person;
  company?: Company;
  emails: Email[];
  phones: Phone[];
  occasions: Occasion[];
  addresses: Address[];
  identifications: Identification[];
  relationships: Relationship[];
  requests: Request[];
  static ref(id: number): Contact;
}
