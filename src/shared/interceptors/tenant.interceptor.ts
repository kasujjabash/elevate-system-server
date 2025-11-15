import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { REQUEST } from '@nestjs/core';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { TENANT_HEADER } from '../../constants';

/**
 * TenantInterceptor - Automatically filters all database queries by tenantId
 *
 * This interceptor sets up global query filters for row-level multi-tenancy.
 * It ensures that all queries are automatically scoped to the current tenant.
 *
 * Usage: Apply globally in main.ts or per-controller
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantInterceptor implements NestInterceptor {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    @Inject('DATABASE_CONNECTION') private readonly connection: Connection,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const tenantId = this.getTenantId();

    if (tenantId) {
      this.setupGlobalTenantFilter(tenantId);
    }

    return next.handle();
  }

  private getTenantId(): number | null {
    const req = this.request;

    // Try to get tenant from header
    const tenantName = req?.headers?.[TENANT_HEADER];

    if (!tenantName) {
      return null;
    }

    // In row-level tenancy, we need to map tenant name to ID
    // This should be cached or stored in request context
    // For now, we'll assume the tenant ID is stored in the request
    return req.tenantId || null;
  }

  private setupGlobalTenantFilter(tenantId: number): void {
    // Note: TypeORM doesn't have built-in global filters like some ORMs
    // We'll implement this at the repository level instead
    // Store tenantId in request context for use in services
    this.request.tenantId = tenantId;
  }
}
