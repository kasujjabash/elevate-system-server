import { DbService } from 'src/shared/db.service';
import { Tenant } from './entities/tenant.entity';
import { TenantDto } from './dto/tenant.dto';
import { Connection } from 'typeorm';
export declare class TenantsService {
  private readonly connection;
  private readonly dbService;
  constructor(connection: Connection, dbService: DbService);
  create(tenantData: TenantDto): Promise<Tenant>;
  findOne(id: number): Promise<Tenant | null>;
  findByName(name: string): Promise<Tenant | null>;
}
