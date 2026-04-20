import { forwardRef, Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ComprehensiveSeedService } from './comprehensive-seed.service';
import { CrmModule } from '../crm/crm.module';
import { UsersModule } from '../users/users.module';
// import { GroupsModule } from '../groups/groups.module';
// import { EventsModule } from '../events/events.module';
import { ReportsModule } from '../reports/reports.module';
import { TenantsModule } from '../tenants/tenants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { groupEntities } from '../groups/groups.helpers';
import { crmEntities } from '../crm/crm.helpers';
import { usersEntities } from '../users/users.helpers';
// import { eventEntities } from '../events/events.helpers';

@Module({
  imports: [
    CrmModule,
    UsersModule,
    // GroupsModule, // Disabled - church-specific
    // EventsModule, // Disabled - church-specific
    ReportsModule,
    forwardRef(() => TenantsModule),
    TypeOrmModule.forFeature([
      ...usersEntities,
      ...crmEntities,
      // ...groupEntities, // Disabled - church-specific
      // ...eventEntities, // Disabled - church-specific
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService, ComprehensiveSeedService],
  exports: [SeedService, ComprehensiveSeedService],
})
export class SeedModule {}
