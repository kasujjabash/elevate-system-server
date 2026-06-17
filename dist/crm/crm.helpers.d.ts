import Contact from './entities/contact.entity';
import Person from './entities/person.entity';
import Company from './entities/company.entity';
import Email from './entities/email.entity';
import Phone from './entities/phone.entity';
import Address from './entities/address.entity';
import Occasion from './entities/occasion.entity';
import Identification from './entities/identification.entity';
import Relationship from './entities/relationship.entity';
import Request from './entities/request.entity';
export declare const getPersonFullName: (person: Partial<Person>) => string;
export declare const crmEntities: (
  | typeof Person
  | typeof Contact
  | typeof Company
  | typeof Email
  | typeof Request
  | typeof Phone
  | typeof Occasion
  | typeof Address
  | typeof Identification
  | typeof Relationship
)[];
export declare const createAvatar: (email: string, size?: number) => string;
export declare const getPhoneObj: (data: Contact) => Phone;
export declare const getEmail: (data: Contact) => string;
export declare const getEmailObj: (data: Contact) => Email;
export declare const getPhone: (data: Contact) => string;
export declare const getCellGroup: (_data: Contact) => any | null;
export declare const getLocation: (_data: Contact) => any | null;
