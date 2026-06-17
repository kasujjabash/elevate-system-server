import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { TenantContext } from '../tenant/tenant-context';
import { Tenant } from 'src/tenants/entities/tenant.entity';
export declare class TenantAwareRepository<
  Entity extends {
    tenant?: Tenant;
  },
> extends Repository<Entity> {
  private readonly tenantContext;
  constructor(target: any, manager: any, tenantContext: TenantContext);
  private addTenantFilter;
  private createTenantReference;
  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findOne(options: FindOneOptions<Entity>): Promise<Entity | null>;
  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
  save<T extends Entity>(entity: T): Promise<T>;
  save<T extends Entity>(entities: T[]): Promise<T[]>;
  create(entityLike?: any): Entity;
  create(entityLikes?: any[]): Entity[];
}
