import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TENANT_HEADER } from '../../constants';

/**
 * TenantContext - Provides access to the current tenant information
 *
 * This is a REQUEST-scoped service that extracts and provides tenant context
 * for the current request.
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private _tenantId: number | null = null;
  private _tenantName: string | null = null;

  constructor(@Inject(REQUEST) private readonly request: any) {
    this.initializeTenantContext();
  }

  private initializeTenantContext(): void {
    const req = this.request;

    // Get tenant name from header (set by middleware)
    this._tenantName = req?.headers?.[TENANT_HEADER] || null;

    // Get tenant ID (should be set by middleware after looking up tenant)
    this._tenantId = req?.tenantId || null;
  }

  get tenantId(): number | null {
    return this._tenantId;
  }

  get tenantName(): string | null {
    return this._tenantName;
  }

  setTenantId(tenantId: number): void {
    this._tenantId = tenantId;
  }

  hasTenant(): boolean {
    return this._tenantId !== null;
  }

  requireTenant(): number {
    if (!this._tenantId) {
      throw new Error('Tenant context is required but not available');
    }
    return this._tenantId;
  }
}
