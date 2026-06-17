'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('../app.module');
const comprehensive_seed_service_1 = require('../seed/comprehensive-seed.service');
const common_1 = require('@nestjs/common');
async function seedDatabase() {
  const app = await core_1.NestFactory.createApplicationContext(
    app_module_1.AppModule,
  );
  const seedService = app.get(
    comprehensive_seed_service_1.ComprehensiveSeedService,
  );
  try {
    common_1.Logger.log('🚀 Starting comprehensive database seeding...');
    const args = process.argv.slice(2);
    if (args.includes('--clear')) {
      common_1.Logger.log('🧹 Clearing existing data...');
      await seedService.clearAll();
      common_1.Logger.log('✅ Data cleared successfully');
      if (!args.includes('--seed')) {
        await app.close();
        process.exit(0);
      }
    }
    if (args.includes('--seed') || args.length === 0) {
      common_1.Logger.log(
        '🌱 Seeding database with MirageJS-compatible data...',
      );
      await seedService.seedAll();
      common_1.Logger.log('🎉 Seeding completed successfully!');
      common_1.Logger.log(
        '\n📋 Available test accounts (password: password123):',
      );
      common_1.Logger.log(
        '   fellowship@worshipharvest.org - MC Shepherd (Phase MC)',
      );
      common_1.Logger.log(
        '   zone@worshipharvest.org       - Zone Leader (North Zone)',
      );
      common_1.Logger.log(
        '   location@worshipharvest.org   - Location Pastor (Kampala)',
      );
      common_1.Logger.log(
        '   fob@worshipharvest.org        - FOB Leader (East Africa)',
      );
      common_1.Logger.log(
        '   network@worshipharvest.org    - Network Leader (Africa)',
      );
      common_1.Logger.log(
        '   movement@worshipharvest.org   - Movement Leader (Global)',
      );
      common_1.Logger.log(
        '   admin@worshipharvest.org      - System Admin (Full Access)',
      );
    }
  } catch (error) {
    common_1.Logger.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🌱 Comprehensive Database Seeding Tool

Usage: npm run seed:comprehensive [options]

Options:
  --seed    Seed the database with MirageJS-compatible data (default)
  --clear   Clear all existing seeded data
  --help    Show this help message

Examples:
  npm run seed:comprehensive           # Seed database
  npm run seed:comprehensive --clear   # Clear data only
  npm run seed:comprehensive --clear --seed  # Clear and re-seed

This will create:
  ✅ 7 test user accounts with different permission levels
  ✅ 6-level group hierarchy (Movement → Network → FOB → Location → Zone → Fellowship)
  ✅ 50+ realistic contacts across all locations
  ✅ 4 report types (MC Attendance, Service, Baptism, Salvation)
  ✅ 8 weeks of historical report submissions with realistic gaps
  ✅ Proper role-based permissions and group access control
  `);
  process.exit(0);
}
seedDatabase();
//# sourceMappingURL=seed-comprehensive.js.map
