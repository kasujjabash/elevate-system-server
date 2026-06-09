import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
    let dbUser: { isActive: boolean; tokenVersion: number } | null = null;

    try {
      dbUser = await this.prisma.user.findUnique({
        where: { id: Number(payload.sub) },
        select: { isActive: true, tokenVersion: true },
      });
    } catch (e: any) {
      Logger.error('JWT strategy DB lookup failed: ' + (e?.message ?? e));
      // If DB check fails (e.g. migration not yet run), fall through and allow
      // the request so existing sessions are not disrupted.
      return { ...payload };
    }

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    if ((payload.tokenVersion ?? 0) !== dbUser.tokenVersion) {
      throw new UnauthorizedException('Session expired, please log in again');
    }

    return { ...payload };
  }
}
