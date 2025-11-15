import { createConnection, Connection, QueryRunner } from "typeorm";
import config, { appEntities } from "src/config";
import { Tenant } from "src/tenants/entities/tenant.entity";

/**
 * Migration script to convert from schema-level to row-level multi-tenancy
 *
 * This script:
 * 1. Reads all tenants from public schema
 * 2. For each tenant schema, migrates data to public schema with tenantId
 * 3. Optionally drops old tenant schemas
 *
 * Usage: npm run migrate:row-level
 */

interface TenantInfo {
  id: number;
  name: string;
  description: string;
}

// Tables that need tenantId (root entities)
const TENANT_TABLES = [
  "contact",
  "group",
  "group_category",
  "event_category",
  "roles",
  "report",
  "help",
  "chat_session",
];

async function migrateToRowLevelTenancy() {
  let publicConnection: Connection;

  try {
    console.log("=".repeat(60));
    console.log("MIGRATION: Schema-Level to Row-Level Multi-Tenancy");
    console.log("=".repeat(60));

    // Step 1: Connect to public schema
    console.log("\n[1/5] Connecting to public schema...");
    publicConnection = await createConnection({
      ...config.database,
      type: "postgres",
      entities: [...appEntities, Tenant],
      schema: "public",
      name: "public",
    });

    const queryRunner = publicConnection.createQueryRunner();

    // Step 2: Get all tenants
    console.log("[2/5] Fetching all tenants...");
    const tenants = await queryRunner.query(
      'SELECT id, name, description FROM public.tenant ORDER BY id'
    ) as TenantInfo[];

    if (tenants.length === 0) {
      console.log("⚠️  No tenants found. Exiting...");
      await queryRunner.release();
      await publicConnection.close();
      return;
    }

    console.log(`   Found ${tenants.length} tenant(s):`);
    tenants.forEach(t => console.log(`   - ${t.name} (ID: ${t.id})`));

    // Step 3: Verify tenant schemas exist
    console.log("\n[3/5] Verifying tenant schemas...");
    const schemasQuery = await queryRunner.query(
      "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema' AND schema_name != 'public'"
    );
    const existingSchemas = schemasQuery.map((row: any) => row.schema_name);

    console.log(`   Found ${existingSchemas.length} tenant schema(s):`);
    existingSchemas.forEach(s => console.log(`   - ${s}`));

    // Step 4: Migrate data for each tenant
    console.log("\n[4/5] Migrating data from tenant schemas to row-level...");

    for (const tenant of tenants) {
      const schemaName = tenant.name.toLowerCase().replace(/\s+/g, '');

      if (!existingSchemas.includes(schemaName)) {
        console.log(`   ⚠️  Schema '${schemaName}' not found, skipping tenant ${tenant.name}`);
        continue;
      }

      console.log(`\n   Processing tenant: ${tenant.name} (schema: ${schemaName})`);
      console.log(`   ${"─".repeat(50)}`);

      try {
        await migrateTenantData(queryRunner, tenant, schemaName);
        console.log(`   ✓ Successfully migrated tenant: ${tenant.name}`);
      } catch (error) {
        console.error(`   ✗ Error migrating tenant ${tenant.name}:`, error.message);
        throw error; // Stop on first error
      }
    }

    // Step 5: Summary
    console.log("\n[5/5] Migration Summary");
    console.log("   " + "─".repeat(50));
    console.log(`   ✓ Successfully migrated ${tenants.length} tenant(s)`);
    console.log(`   ✓ Data now uses row-level tenancy with tenantId`);
    console.log("\n⚠️  IMPORTANT NEXT STEPS:");
    console.log("   1. Verify data integrity in the database");
    console.log("   2. Test your application thoroughly");
    console.log("   3. Update application code to use new row-level tenancy");
    console.log("   4. After verification, manually drop old schemas:");
    tenants.forEach(t => {
      const schemaName = t.name.toLowerCase().replace(/\s+/g, '');
      console.log(`      DROP SCHEMA IF EXISTS ${schemaName} CASCADE;`);
    });

    await queryRunner.release();
    await publicConnection.close();

    console.log("\n" + "=".repeat(60));
    console.log("MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60) + "\n");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    if (publicConnection) {
      await publicConnection.close();
    }
    process.exit(1);
  }
}

/**
 * Get column information for a table including enum types
 */
async function getTableColumns(
  queryRunner: QueryRunner,
  schemaName: string,
  tableName: string
): Promise<Array<{ column_name: string; data_type: string; udt_name: string }>> {
  return await queryRunner.query(
    `SELECT column_name, data_type, udt_name
     FROM information_schema.columns
     WHERE table_schema = $1 AND table_name = $2
     ORDER BY ordinal_position`,
    [schemaName, tableName]
  );
}

/**
 * Get columns that exist in target (public) schema
 */
async function getTargetTableColumns(
  queryRunner: QueryRunner,
  tableName: string
): Promise<Set<string>> {
  const columns = await queryRunner.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1`,
    [tableName]
  );
  return new Set(columns.map((col: any) => col.column_name));
}

/**
 * Build SELECT statement with proper enum casting, only for columns that exist in target
 */
function buildSelectWithEnumCasting(
  columns: Array<{ column_name: string; data_type: string; udt_name: string }>,
  targetColumns: Set<string>,
  schemaName: string,
  tenantId: number,
  addTenantId: boolean
): { selectClause: string; insertColumns: string } {
  const columnSelects: string[] = [];
  const insertColumnNames: string[] = [];

  columns.forEach(col => {
    // Skip columns that don't exist in target table
    if (addTenantId && col.column_name === 'tenantId') {
      // Will add tenantId separately
      return;
    }

    if (!targetColumns.has(col.column_name)) {
      return; // Skip this column
    }

    insertColumnNames.push(`"${col.column_name}"`);

    // Check if it's a user-defined type (likely an enum)
    if (col.data_type === 'USER-DEFINED') {
      // Double cast: schema-specific enum -> text -> public enum
      // This avoids schema-specific enum type issues
      columnSelects.push(`"${col.column_name}"::text::${col.udt_name}`);
    } else {
      columnSelects.push(`"${col.column_name}"`);
    }
  });

  if (addTenantId && targetColumns.has('tenantId')) {
    insertColumnNames.push(`"tenantId"`);
    columnSelects.push(`${tenantId} as "tenantId"`);
  }

  return {
    selectClause: columnSelects.join(', '),
    insertColumns: `(${insertColumnNames.join(', ')})`
  };
}

async function migrateTenantData(
  queryRunner: QueryRunner,
  tenant: TenantInfo,
  schemaName: string
): Promise<void> {
  const tenantId = tenant.id;

  // Order matters due to foreign key constraints
  // We need to migrate in dependency order
  const migrationOrder = [
    // 1. Root entities with no dependencies
    { table: "group_category", hasData: true },
    { table: "event_category", hasData: true },
    { table: "roles", hasData: true },
    { table: "contact", hasData: true },
    { table: "help", hasData: true },
    { table: "chat_session", hasData: true },

    // 2. Entities that depend on contact
    { table: "person", hasData: false }, // OneToOne with contact
    { table: "company", hasData: false },
    { table: "email", hasData: false },
    { table: "phone", hasData: false },
    { table: "address", hasData: false },
    { table: "identification", hasData: false },
    { table: "occasion", hasData: false },
    { table: "relationship", hasData: false },
    { table: "request", hasData: false },
    { table: "user", hasData: false }, // OneToOne with contact

    // 3. User-dependent entities
    { table: "user_roles", hasData: false },

    // 4. Group entities
    { table: "group", hasData: true }, // Depends on group_category
    { table: "group_closure", hasData: false }, // Tree structure table
    { table: "group_membership", hasData: false },
    { table: "group_membership_request", hasData: false },

    // 5. Event entities
    { table: "event_field", hasData: false },
    { table: "group_event", hasData: false },
    { table: "event_registration", hasData: false },
    { table: "event_attendance", hasData: false },
    { table: "event_activity", hasData: false },
    { table: "member_event_activities", hasData: false },

    // 6. Report entities
    { table: "report", hasData: true },
    { table: "report_field", hasData: false },
    { table: "report_submission", hasData: false },
    { table: "report_submission_data", hasData: false },

    // 7. Chat entities
    { table: "chat_node", hasData: false },
  ];

  for (const { table, hasData } of migrationOrder) {
    try {
      // Check if table exists in tenant schema
      const tableExists = await queryRunner.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = $1 AND table_name = $2
        )`,
        [schemaName, table]
      );

      if (!tableExists[0].exists) {
        console.log(`      ⊘ Table '${table}' not found in schema, skipping...`);
        continue;
      }

      // Get row count
      const countResult = await queryRunner.query(
        `SELECT COUNT(*) as count FROM "${schemaName}"."${table}"`
      );
      const rowCount = parseInt(countResult[0].count);

      if (rowCount === 0) {
        console.log(`      ⊘ Table '${table}': 0 rows, skipping...`);
        continue;
      }

      // Get column information to handle enum casting
      const columns = await getTableColumns(queryRunner, schemaName, table);
      const targetColumns = await getTargetTableColumns(queryRunner, table);
      const { selectClause, insertColumns } = buildSelectWithEnumCasting(
        columns,
        targetColumns,
        schemaName,
        tenantId,
        hasData
      );

      // Migrate data with proper enum casting and explicit column list
      await queryRunner.query(`
        INSERT INTO public."${table}" ${insertColumns}
        SELECT ${selectClause}
        FROM "${schemaName}"."${table}"
        ON CONFLICT DO NOTHING
      `);

      console.log(`      ✓ Table '${table}': migrated ${rowCount} row(s)${hasData ? ` with tenantId=${tenantId}` : ' (tenantId inferred)'}`);

    } catch (error) {
      console.error(`      ✗ Error migrating table '${table}':`, error.message);
      throw error;
    }
  }
}

// Run the migration
migrateToRowLevelTenancy();
