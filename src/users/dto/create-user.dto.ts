import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  contactId: number;

  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  roles: string[];
  @IsNotEmpty()
  isActive: boolean;

  /** Required when role is HUB_MANAGER — links the user to their hub */
  @IsOptional()
  @IsNumber()
  hubId?: number;
}
