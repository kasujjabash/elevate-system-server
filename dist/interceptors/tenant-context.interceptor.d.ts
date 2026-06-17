import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
export declare class TenantContextInterceptor implements NestInterceptor {
  private readonly reflector;
  private readonly usersService;
  private readonly logger;
  constructor(reflector: Reflector, usersService: UsersService);
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>>;
}
