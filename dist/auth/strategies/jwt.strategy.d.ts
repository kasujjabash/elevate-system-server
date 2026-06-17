import { Strategy } from 'passport-jwt';
import { UserDto } from '../dto/user.dto';
import { PrismaService } from '../../shared/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
  private readonly prisma;
  constructor(prisma: PrismaService);
  validate(payload: any): Promise<UserDto>;
}
export {};
