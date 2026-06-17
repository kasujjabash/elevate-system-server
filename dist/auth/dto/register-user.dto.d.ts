import { CivilStatus } from '../../crm/enums/civilStatus';
import { Gender } from '../../crm/enums/gender';
export declare class RegisterUserDto {
  email: string;
  phone: string;
  password: string;
  roles: string[];
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  civilStatus: CivilStatus;
  dateOfBirth: string | Date;
}
