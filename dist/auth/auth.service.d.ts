import { UsersService } from '../users/users.service';
import { UserDto } from './dto/user.dto';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { JwtHelperService } from './jwt-helpers.service';
import { UserListDto } from 'src/users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  HierarchyDto,
} from './dto/login-response.dto';
import { PrismaService } from '../shared/prisma.service';
export declare class AuthService {
  private usersService;
  private jwtHelperService;
  private jwtService;
  private prisma;
  constructor(
    usersService: UsersService,
    jwtHelperService: JwtHelperService,
    jwtService: JwtService,
    prisma: PrismaService,
  );
  validateUser(
    username: string,
    pass: string,
    _hub?: string,
  ): Promise<UserDto | null>;
  generateToken(
    user: UserDto | UserListDto,
    tenant: string,
  ): Promise<LoginResponseDto>;
  decodeToken(token: string): Promise<any>;
  forgotPassword(username: string): Promise<ForgotPasswordResponseDto>;
  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ResetPasswordResponseDto>;
  getPermissions(roles: string[]): Promise<string[]>;
  refreshToken(_refreshToken: string): Promise<RefreshTokenResponseDto>;
  logout(): Promise<{
    message: string;
  }>;
  getUserHierarchy(_userId: number): Promise<HierarchyDto>;
  getFullProfile(contactId: number): Promise<{
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
    contactId: number,
    dto: {
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
}
