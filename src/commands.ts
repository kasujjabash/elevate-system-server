import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantDto } from './tenants/dto/tenant.dto';
import { TenantsService } from './tenants/tenants.service';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const command = process.argv[2];
  const tenantName = process.argv[3];

  switch (command) {
    case 'create-tenant':
      const tenantsService = application.get(TenantsService);
      const tenantDto: TenantDto = { name: tenantName };
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
