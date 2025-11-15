# Migration Guide: Schema-Level to Row-Level Multi-Tenancy

## Overview

This guide documents the migration from schema-level multi-tenancy (where each tenant has its own PostgreSQL schema) to row-level multi-tenancy (where all tenants share the same schema with data separated by `tenantId`).

## Why Row-Level Tenancy?

**Benefits:**
- **Simpler architecture**: Single schema, easier to maintain and scale
- **Easier migrations**: Database schema changes apply to all tenants at once
- **Better resource utilization**: No per-schema overhead
- **Simplified backups**: Single schema to backup/restore
- **Cross-tenant queries** (if needed): Possible with proper filtering

**Trade-offs:**
- **Data isolation**: Application-level vs database-level (mitigated with proper filtering and testing)
- **Requires careful query filtering**: Must ensure all queries filter by `tenantId`

---

## What Changed

### 1. **Entity Definitions**

Eight root entities now have a `tenantId` field and relationship:

- `Contact` (`src/crm/entities/contact.entity.ts`)
- `Group` (`src/groups/entities/group.entity.ts`)
- `GroupCategory` (`src/groups/entities/groupCategory.entity.ts`)
- `EventCategory` (`src/events/entities/eventCategory.entity.ts`)
- `Roles` (`src/users/entities/roles.entity.ts`)
- `Report` (`src/reports/entities/report.entity.ts`)
- `Help` (`src/help/entities/help.entity.ts`)
- `ChatSession` (`src/bot/entities/chat-session.entity.ts`)

**Example:**
```typescript
@Entity()
@Index(["tenantId", "id"])
export default class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  // ... rest of fields
}
```

### 2. **Database Configuration**

**`src/app.module.ts`:**
- Added `Tenant` entity to TypeORM configuration
- Set `schema: 'public'` to use single schema

### 3. **Connection Management**

**`src/shared/db.service.ts`:**
- Removed schema-based connection logic
- Now uses single connection via `@InjectConnection()`
- Added helper methods: `getTenantByName()`, `getTenantById()`

**`src/tenants/tenants.module.ts`:**
- Simplified connection factory to return single connection
- Added tenant validation provider
- Exports `TenantContext` for use in services

### 4. **Tenant Context**

**New files:**
- `src/shared/tenant/tenant-context.ts`: REQUEST-scoped service providing tenant info
- `src/shared/repository/tenant-aware.repository.ts`: Base repository class with automatic tenant filtering

### 5. **Services & Seeding**

**`src/tenants/tenants.service.ts`:**
- No longer creates separate schemas
- Updated to work with single connection

---

## Migration Steps

### Prerequisites

1. **Backup your database**
   ```bash
   pg_dump -U <username> -d <database> -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump
   ```

2. **Ensure you're on staging environment first**

3. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

### Step 1: Update Codebase

The codebase has already been updated with all necessary changes. Review the changes in:
- Entity files
- `src/app.module.ts`
- `src/shared/db.service.ts`
- `src/tenants/tenants.module.ts`
- `src/tenants/tenants.service.ts`

### Step 2: Run Database Migration

**On staging environment:**

```bash
# Run the migration script
npm run migrate:row-level
```

This script will:
1. Connect to the public schema
2. Fetch all tenants
3. For each tenant schema:
   - Read all data from tables
   - Add `tenantId` to root entities
   - Insert data into public schema
4. Display migration summary

**Expected output:**
```
============================================================
MIGRATION: Schema-Level to Row-Level Multi-Tenancy
============================================================

[1/5] Connecting to public schema...
[2/5] Fetching all tenants...
   Found 2 tenant(s):
   - churcha (ID: 1)
   - demo (ID: 2)

[3/5] Verifying tenant schemas...
   Found 2 tenant schema(s):
   - churcha
   - demo

[4/5] Migrating data from tenant schemas to row-level...
   Processing tenant: churcha (schema: churcha)
   ──────────────────────────────────────────────────
      ✓ Table 'contact': migrated 150 row(s) with tenantId=1
      ✓ Table 'group': migrated 25 row(s) with tenantId=1
   ...
   ✓ Successfully migrated tenant: churcha

[5/5] Migration Summary
   ──────────────────────────────────────────────────
   ✓ Successfully migrated 2 tenant(s)
   ✓ Data now uses row-level tenancy with tenantId

============================================================
MIGRATION COMPLETED SUCCESSFULLY!
============================================================
```

### Step 3: Verify Data Integrity

After migration, verify data in the database:

```sql
-- Check tenant count
SELECT COUNT(*) FROM public.tenant;

-- Check data distribution by tenant
SELECT tenantId, COUNT(*) FROM public.contact GROUP BY tenantId;
SELECT tenantId, COUNT(*) FROM public."group" GROUP BY tenantId;
SELECT tenantId, COUNT(*) FROM public.group_category GROUP BY tenantId;

-- Verify foreign key integrity
SELECT c.id, c.tenantId, u.id as user_id, u."contactId"
FROM contact c
LEFT JOIN "user" u ON c.id = u."contactId"
LIMIT 10;
```

### Step 4: Build and Test Application

```bash
# Build the application
npm run build

# Start the application
npm run start:dev

# Or in production
npm run start:prod
```

**Test checklist:**
- [ ] User login works for all tenants
- [ ] Data is properly isolated between tenants
- [ ] Creating new contacts/groups works
- [ ] Existing relationships are intact
- [ ] Reports generate correctly
- [ ] No cross-tenant data leakage

### Step 5: Clean Up Old Schemas (After Verification)

⚠️ **IMPORTANT**: Only do this after thorough testing and verification!

After confirming everything works correctly, you can drop the old tenant schemas:

```sql
-- Connect to your database
-- Run these commands to drop old schemas

DROP SCHEMA IF EXISTS churcha CASCADE;
DROP SCHEMA IF EXISTS demo CASCADE;

-- Verify only public schema remains (plus system schemas)
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name NOT LIKE 'pg_%'
  AND schema_name != 'information_schema';
```

---

## Testing Strategy

### Unit Tests

For services that work with tenant data, ensure you:
1. Mock `TenantContext` to return a test tenant ID
2. Verify queries include `tenantId` filtering
3. Test cross-tenant isolation

**Example:**
```typescript
const mockTenantContext = {
  tenantId: 1,
  tenantName: 'test',
  hasTenant: () => true,
  requireTenant: () => 1,
};
```

### Integration Tests

1. **Create test tenants**: Create 2+ test tenants
2. **Data isolation**: Verify data created in tenant A is not visible in tenant B
3. **Cross-tenant queries**: Ensure they're blocked/filtered
4. **Tenant switching**: Verify switching between tenants works correctly

### Manual Testing

1. Log in as user from tenant A
2. Create contacts, groups, events
3. Log out and log in as user from tenant B
4. Verify you don't see tenant A's data
5. Create separate data for tenant B
6. Switch back to tenant A and verify data is still correct

---

## Troubleshooting

### Migration Script Fails

**Issue**: Migration script throws error

**Solutions**:
1. Check database connection settings in `.env`
2. Ensure you have sufficient permissions
3. Check for disk space
4. Review error message for specific table/constraint issues

### Data Not Showing After Migration

**Issue**: Application runs but no data appears

**Check**:
1. Verify tenant context is being set correctly
   ```typescript
   // In any service, log the tenant context
   Logger.log('Tenant ID:', this.tenantContext.tenantId);
   ```

2. Check if middleware is setting tenant header
   ```bash
   # In browser dev tools, check request headers
   # Should see: tenant: churcha (or your tenant name)
   ```

3. Verify data exists in database
   ```sql
   SELECT * FROM public.contact LIMIT 10;
   ```

### Cross-Tenant Data Leakage

**Issue**: Seeing data from other tenants

**Fix**:
1. Verify all queries use TenantContext or TenantAwareRepository
2. Check for raw SQL queries that don't filter by tenantId
3. Add explicit `WHERE tenantId = ?` to all queries

---

## Rollback Plan

If you need to rollback:

### Option 1: Restore from Backup
```bash
pg_restore -U <username> -d <database> -v backup_YYYYMMDD_HHMMSS.dump
```

### Option 2: Keep Old Schemas
If you haven't deleted the old tenant schemas yet:
1. Revert code changes using git
2. Old schemas are still intact
3. Application will reconnect to schema-based model

```bash
git revert <commit-hash>
npm install
npm run build
```

---

## Performance Considerations

### Indexes

All root entities now have composite indexes:
- `(tenantId, id)`: Primary lookups
- `(tenantId)`: Filtering

Additional indexes to consider based on usage:
```sql
-- If filtering by name frequently
CREATE INDEX idx_contact_tenant_name ON contact(tenantId, name);
CREATE INDEX idx_group_tenant_name ON "group"(tenantId, name);
```

### Query Optimization

- Always filter by `tenantId` first in WHERE clauses
- Use `EXPLAIN ANALYZE` to verify index usage
- Monitor slow query log for missing indexes

---

## Service Updates Required

### Using TenantContext in Services

Services should inject and use `TenantContext`:

```typescript
import { TenantContext } from 'src/shared/tenant/tenant-context';

@Injectable()
export class MyService {
  constructor(
    @Inject('CONNECTION') private connection: Connection,
    private readonly tenantContext: TenantContext,
  ) {}

  async findAll() {
    const tenantId = this.tenantContext.requireTenant();
    const repository = this.connection.getRepository(MyEntity);

    return repository.find({
      where: { tenantId },
    });
  }

  async create(data: any) {
    const tenantId = this.tenantContext.requireTenant();
    const repository = this.connection.getRepository(MyEntity);

    return repository.save({
      ...data,
      tenantId,
    });
  }
}
```

### Using TenantAwareRepository

For automatic filtering, use the `TenantAwareRepository`:

```typescript
import { TenantAwareRepository } from 'src/shared/repository/tenant-aware.repository';

@Injectable()
export class MyService {
  private repository: TenantAwareRepository<MyEntity>;

  constructor(
    @Inject('CONNECTION') private connection: Connection,
    private readonly tenantContext: TenantContext,
  ) {
    this.repository = new TenantAwareRepository(
      MyEntity,
      connection.manager,
      tenantContext,
    );
  }

  async findAll() {
    // Automatically filtered by tenantId
    return this.repository.find();
  }

  async create(data: any) {
    // tenantId automatically added
    return this.repository.save(data);
  }
}
```

---

## Support & Questions

If you encounter issues:

1. Check the logs: `docker logs <container>` or application logs
2. Verify database state with SQL queries
3. Review this documentation
4. Check git history for recent changes: `git log --oneline`

---

## Summary

This migration simplifies the multi-tenancy architecture by moving from schema-level to row-level isolation. The key changes are:

✅ All data now in `public` schema with `tenantId` column
✅ Single database connection for all tenants
✅ Automatic tenant filtering via `TenantContext`
✅ Simplified tenant creation (no schema creation)
✅ Easier migrations and maintenance

**Next Steps:**
1. Run migration on staging
2. Test thoroughly
3. Run on production during maintenance window
4. Monitor for issues
5. Clean up old schemas after verification period

Good luck! 🚀
