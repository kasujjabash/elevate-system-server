import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DbService } from 'src/shared/db.service';
import { Tenant } from './entities/tenant.entity';
import { TenantDto } from './dto/tenant.dto';
import { lowerCaseRemoveSpaces } from 'src/utils/stringHelpers';
import { Connection } from 'typeorm';

@Injectable()
export class TenantsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly dbService: DbService,
  ) {}

  async create(tenantData: TenantDto): Promise<Tenant> {
    const tenantName = lowerCaseRemoveSpaces(tenantData.name);
    const tenantDetails = await this.dbService.createTenant({
      name: tenantName,
    });
    Logger.log(`Tenant created: ${tenantName} (ID: ${tenantDetails.id})`);
    return tenantDetails;
  }

  async findOne(id: number): Promise<Tenant | null> {
    return await this.dbService.getTenantById(id);
  }

  async findByName(name: string): Promise<Tenant | null> {
    return await this.dbService.getTenantByName(name);
  }
}
