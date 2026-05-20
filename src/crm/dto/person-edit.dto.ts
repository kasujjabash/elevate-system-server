import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Gender } from '../enums/gender';
import { CivilStatus } from '../enums/civilStatus';
import { Salutation } from '../enums/salutation';

export class PersonEditDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  middleName?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(CivilStatus)
  civilStatus?: CivilStatus;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  residence?: string;

  placeOfWork?: string;

  @IsOptional()
  @IsNumber()
  contactId?: number;

  @IsOptional()
  @IsEnum(Salutation)
  salutation?: Salutation;

  age?: string;

  avatar?: string;
}
