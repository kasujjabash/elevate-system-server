import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsArray()
  roles?: string[];
  oldPassword?: string;
  password?: string;
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  contactId?: number;

  @IsOptional()
  @IsNumber()
  hubId?: number;

  @IsOptional()
  @IsArray()
  courseIds?: number[];

  @IsOptional()
  phone?: string;

  @IsOptional()
  dateOfBirth?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;
}
