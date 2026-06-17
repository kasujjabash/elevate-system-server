import { NestMiddleware } from '@nestjs/common';
export declare class TenantHeaderMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void;
}
