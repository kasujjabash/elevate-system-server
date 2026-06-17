import { Gender } from '../enums/gender';
import { CivilStatus } from '../enums/civilStatus';
import { Salutation } from '../enums/salutation';
export declare class PersonEditDto {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: Gender;
  civilStatus?: CivilStatus;
  dateOfBirth?: Date;
  residence?: string;
  placeOfWork?: string;
  contactId?: number;
  salutation?: Salutation;
  age?: string;
  avatar?: string;
}
