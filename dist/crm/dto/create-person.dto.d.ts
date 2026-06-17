import { CivilStatus } from '../enums/civilStatus';
import { Gender } from '../enums/gender';
export declare class CreatePersonDto {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  civilStatus?: CivilStatus;
  dateOfBirth: Date | string;
  ageGroup?: string;
  placeOfWork?: string;
  residence?: any;
  cellGroupId?: any;
  churchLocationId?: number;
  inCell?: any;
  joinCell?: any;
}
