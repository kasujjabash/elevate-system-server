import { Connection } from 'typeorm';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { TenantDto } from 'src/tenants/dto/tenant.dto';
export declare class DbService {
  private readonly connection;
  constructor(connection: Connection);
  getConnection(): Promise<Connection>;
  createTenant(tenantData: TenantDto): Promise<Tenant>;
  getTenantByName(name: string): Promise<Tenant | null>;
  getTenantById(id: number): Promise<Tenant | null>;
}
