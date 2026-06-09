import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserDto } from '../dto/user.dto';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<UserDto> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { isActive: true, tokenVersion: true },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    if ((payload.tokenVersion ?? 0) !== dbUser.tokenVersion) {
      throw new UnauthorizedException('Session expired, please log in again');
    }

    return { ...payload };
  }
}
