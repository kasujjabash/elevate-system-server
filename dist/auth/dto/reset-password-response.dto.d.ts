import { UserListDto } from '../../users/dto/user.dto';
export declare class ResetPasswordResponseDto {
  message: string;
  mailURL: string;
  user: UserListDto;
}
