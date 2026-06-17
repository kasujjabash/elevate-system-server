import { CreatePersonDto } from '../dto/create-person.dto';
import { Gender } from '../enums/gender';
type Name = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export declare const parseName: (name?: string) => Name | null;
export declare const parseGender: (value?: string) => Gender | null;
export declare const parseDateOfBirth: (
  dateOfBirthRaw?: string,
) => string | null;
export declare function parseContact({
  phone,
  name,
  email,
  birthday,
  gender,
  residence,
  placeOfWork,
  ageGroup,
}: any): CreatePersonDto | null;
export {};
