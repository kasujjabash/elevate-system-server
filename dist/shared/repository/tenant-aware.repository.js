'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TenantAwareRepository = void 0;
const typeorm_1 = require('typeorm');
const tenant_entity_1 = require('../../tenants/entities/tenant.entity');
class TenantAwareRepository extends typeorm_1.Repository {
  constructor(target, manager, tenantContext) {
    super(target, manager);
    this.tenantContext = tenantContext;
  }
  addTenantFilter(where) {
    const tenantId = this.tenantContext.tenantId;
    if (!tenantId) {
      return where;
    }
    const tenantFilter = { tenant: { id: tenantId } };
    if (!where) {
      return tenantFilter;
    }
    if (Array.isArray(where)) {
      return where.map((w) => ({ ...w, tenant: { id: tenantId } }));
    }
    return { ...where, tenant: { id: tenantId } };
  }
  createTenantReference(tenantId) {
    const tenant = new tenant_entity_1.Tenant();
    tenant.id = tenantId;
    return tenant;
  }
  async find(options) {
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
  async findOne(options) {
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
  async findAndCount(options) {
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
  async save(entityOrEntities) {
    const tenantId = this.tenantContext.tenantId;
    if (!tenantId) {
      return super.save(entityOrEntities);
    }
    if (Array.isArray(entityOrEntities)) {
      const entitiesWithTenant = entityOrEntities.map((entity) => {
        if (!entity.tenant) {
          entity.tenant = this.createTenantReference(tenantId);
        }
        return entity;
      });
      return super.save(entitiesWithTenant);
    } else {
      if (!entityOrEntities.tenant) {
        entityOrEntities.tenant = this.createTenantReference(tenantId);
      }
      return super.save(entityOrEntities);
    }
  }
  create(entityLikeOrLikes) {
    const tenantId = this.tenantContext.tenantId;
    if (Array.isArray(entityLikeOrLikes)) {
      const entities = super.create(entityLikeOrLikes);
      if (tenantId) {
        entities.forEach((entity) => {
          if (!entity.tenant) {
            entity.tenant = this.createTenantReference(tenantId);
          }
        });
      }
      return entities;
    }
    const entity = super.create(entityLikeOrLikes);
    if (tenantId && !entity.tenant) {
      entity.tenant = this.createTenantReference(tenantId);
    }
    return entity;
  }
}
exports.TenantAwareRepository = TenantAwareRepository;
//# sourceMappingURL=tenant-aware.repository.js.map
