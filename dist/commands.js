'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('./app.module');
const tenants_service_1 = require('./tenants/tenants.service');
async function bootstrap() {
  const application = await core_1.NestFactory.createApplicationContext(
    app_module_1.AppModule,
  );
  const command = process.argv[2];
  const tenantName = process.argv[3];
  switch (command) {
    case 'create-tenant':
      const tenantsService = application.get(tenants_service_1.TenantsService);
      const tenantDto = { name: tenantName };
      await tenantsService.create(tenantDto);
      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }
  await application.close();
  process.exit(0);
}
bootstrap();
//# sourceMappingURL=commands.js.map
