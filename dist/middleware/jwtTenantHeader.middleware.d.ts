import { NestMiddleware } from '@nestjs/common';
import { JwtHelperService } from 'src/auth/jwt-helpers.service';
export declare class JwtTenantHeaderMiddleware implements NestMiddleware {
  private readonly jwtService;
  constructor(jwtService: JwtHelperService);
  use(req: any, res: any, next: () => void): Promise<void>;
}
