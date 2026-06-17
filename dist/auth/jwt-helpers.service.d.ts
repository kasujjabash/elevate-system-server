import { JwtService } from '@nestjs/jwt';
import { UserListDto } from 'src/users/dto/user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserDto } from './dto/user.dto';
import { JwtSignOptions } from '@nestjs/jwt';
export declare class JwtHelperService {
  private readonly jwtService;
  constructor(jwtService: JwtService);
  generateToken(
    user: UserDto | UserListDto,
    options?: JwtSignOptions,
  ): Promise<LoginResponseDto>;
  decodeToken(token: string): Promise<any>;
}
