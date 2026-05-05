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

  /** Update hub assignment for HUB_MANAGER users */
  @IsOptional()
  @IsNumber()
  hubId?: number;
}
