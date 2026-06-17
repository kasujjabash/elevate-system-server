import { Salutation } from '../enums/salutation';
import Contact from './contact.entity';
import { Gender } from '../enums/gender';
import { CivilStatus } from '../enums/civilStatus';
export default class Person {
  id: number;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  middleName: string;
  ageGroup: string;
  placeOfWork: string;
  gender: Gender;
  civilStatus: CivilStatus;
  avatar: string;
  dateOfBirth: Date | string;
  contact: Contact;
  contactId: number;
}
