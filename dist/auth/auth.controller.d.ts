import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
} from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ValidateEmailDto,
  ValidatePasswordDto,
} from './dto/reset-password.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
export declare class AuthController {
  private readonly authService;
  constructor(authService: AuthService);
  login(req: any): Promise<LoginResponseDto>;
  getMe(req: any): Promise<LoginResponseDto>;
  getProfile(req: any): Promise<{
    contactId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date;
    avatar: string;
    email: string;
    phone: string;
    hub: string;
    hubCode: string;
  }>;
  updateProfile(
    req: any,
    body: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    },
  ): Promise<{
    contactId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    gender: string;
    dateOfBirth: Date;
    avatar: string;
    email: string;
    phone: string;
    hub: string;
    hubCode: string;
  }>;
  refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto>;
  logout(): Promise<{
    message: string;
  }>;
  forgotPassword(data: ValidateEmailDto): Promise<ForgotPasswordResponseDto>;
  resetPassword(
    token: string,
    data: ValidatePasswordDto,
  ): Promise<ResetPasswordResponseDto>;
}
