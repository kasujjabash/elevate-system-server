import { Repository, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm';
import { TenantContext } from '../tenant/tenant-context';

/**
 * Base class for tenant-aware repositories
 *
 * This class automatically adds tenantId filtering to all queries for entities
 * that have a direct tenantId field.
 *
 * Usage:
 * ```typescript
 * const contactRepository = new TenantAwareRepository(Contact, connection, tenantContext);
 * const contacts = await contactRepository.find(); // Automatically filtered by tenantId
 * ```
 */
export class TenantAwareRepository<Entity extends { tenantId?: number }> extends Repository<Entity> {
  constructor(
    target: any,
    manager: any,
    private readonly tenantContext: TenantContext,
  ) {
    super(target, manager);
  }

  /**
   * Add tenantId filter to where conditions
   */
  private addTenantFilter<T extends FindOptionsWhere<Entity>>(
    where?: T | T[],
  ): T | T[] | undefined {
    const tenantId = this.tenantContext.tenantId;

    if (!tenantId) {
      return where;
    }

    if (!where) {
      return { tenantId } as T;
    }

    if (Array.isArray(where)) {
      return where.map((w) => ({ ...w, tenantId } as T));
    }

    return { ...where, tenantId } as T;
  }

  /**
   * Override find to automatically add tenantId filter
   */
  async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    const tenantId = this.tenantContext.tenantId;

    if (!tenantId) {
      return super.find(options);
    }

    const modifiedOptions = {
      ...options,
      where: this.addTenantFilter(options?.where),
    };

    return super.find(modifiedOptions);
  }

  /**
   * Override findOne to automatically add tenantId filter
   */
  async findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    const tenantId = this.tenantContext.tenantId;

    if (!tenantId) {
      return super.findOne(options);
    }

    const modifiedOptions = {
      ...options,
      where: this.addTenantFilter(options?.where),
    };

    return super.findOne(modifiedOptions);
  }

  /**
   * Override findAndCount to automatically add tenantId filter
   */
  async findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
    const tenantId = this.tenantContext.tenantId;

    if (!tenantId) {
      return super.findAndCount(options);
    }

    const modifiedOptions = {
      ...options,
      where: this.addTenantFilter(options?.where),
    };

    return super.findAndCount(modifiedOptions);
  }

  /**
   * Override save to automatically add tenantId to new entities
   */
  async save<T extends Entity>(entity: T): Promise<T>;
  async save<T extends Entity>(entities: T[]): Promise<T[]>;
  async save<T extends Entity>(entityOrEntities: T | T[]): Promise<T | T[]> {
    const tenantId = this.tenantContext.tenantId;

    if (!tenantId) {
      return super.save(entityOrEntities as any);
    }

    if (Array.isArray(entityOrEntities)) {
      const entitiesWithTenant = entityOrEntities.map((entity) => {
        if (!entity.tenantId) {
          entity.tenantId = tenantId;
        }
        return entity;
      });
      return super.save(entitiesWithTenant as any);
    } else {
      if (!entityOrEntities.tenantId) {
        entityOrEntities.tenantId = tenantId;
      }
      return super.save(entityOrEntities as any);
    }
  }

  /**
   * Override create to automatically add tenantId
   */
  create(entityLike?: any): Entity;
  create(entityLikes?: any[]): Entity[];
  create(entityLikeOrLikes?: any | any[]): Entity | Entity[] {
    const tenantId = this.tenantContext.tenantId;

    if (Array.isArray(entityLikeOrLikes)) {
      const entities = super.create(entityLikeOrLikes as any[]);
      if (tenantId) {
        entities.forEach((entity) => {
          if (!entity.tenantId) {
            entity.tenantId = tenantId;
          }
        });
      }
      return entities;
    } else {
      const entity = super.create(entityLikeOrLikes);
      if (tenantId && !entity.tenantId) {
        entity.tenantId = tenantId;
      }
      return entity;
    }
  }
}
