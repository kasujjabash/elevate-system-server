import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Connection } from 'typeorm';
export declare class TenantInterceptor implements NestInterceptor {
  private readonly request;
  private readonly connection;
  constructor(request: any, connection: Connection);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
  private getTenantId;
  private setupGlobalTenantFilter;
}
