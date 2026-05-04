import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  contactId?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  roles: string[];

  @IsNotEmpty()
  isActive: boolean;

  @IsOptional()
  @IsNumber()
  hubId?: number;

  @IsOptional()
  @IsArray()
  courseIds?: number[];
}
