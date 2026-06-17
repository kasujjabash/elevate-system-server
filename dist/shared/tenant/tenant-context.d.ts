export declare class TenantContext {
  private readonly request;
  private _tenantId;
  private _tenantName;
  constructor(request: any);
  private initializeTenantContext;
  get tenantId(): number | null;
  get tenantName(): string | null;
  setTenantId(tenantId: number): void;
  hasTenant(): boolean;
  requireTenant(): number;
}
