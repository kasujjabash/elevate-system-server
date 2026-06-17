import { UserListDto } from 'src/users/dto/user.dto';
export declare class ForgotPasswordResponseDto {
  token: string;
  mailURL: string;
  message?: string;
  user?: UserListDto;
}
