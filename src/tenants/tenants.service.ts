import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { DbService } from "src/shared/db.service";
import { Tenant } from "./entities/tenant.entity";
import { TenantDto } from "./dto/tenant.dto";
import { SeedService } from "src/seed/seed.service";
import { lowerCaseRemoveSpaces } from "src/utils/stringHelpers";
import { Connection } from "typeorm";
import { JwtHelperService } from "src/auth/jwt-helpers.service";
import { ContactsService } from "src/crm/contacts.service";
import { GoogleService } from "src/vendor/google.service";
import { PrismaService } from "src/shared/prisma.service";
import { GroupFinderService } from "src/crm/group-finder/group-finder.service";
import { AddressesService } from "src/crm/addresses.service";
import { GroupCategoriesService } from "src/groups/services/group-categories.service";
import { GroupPermissionsService } from "src/groups/services/group-permissions.service";
import { GroupsMembershipService } from "src/groups/services/group-membership.service";

/**
 * TenantsService - Manages tenant creation for row-level multi-tenancy
 *
 * Updated to work with row-level tenancy - no longer creates separate schemas
 */
@Injectable()
export class TenantsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(
    tenantData: TenantDto,
    dbService: DbService,
    seedService: SeedService,
    googleService: GoogleService,
    jwtHelperService: JwtHelperService,
    prisma: PrismaService,
    groupFinderService: GroupFinderService,
    addressesService: AddressesService,
    groupsPermissionsService: GroupPermissionsService,
  ): Promise<Tenant> {
    const tenantName = lowerCaseRemoveSpaces(tenantData.name);

    // Create tenant in database
    const tenantDetails = await dbService.createTenant({ name: tenantName });

    Logger.log(`Tenant created: ${tenantName} (ID: ${tenantDetails.id})`);

    // Create a temporary request-like object with tenant context for seeding
    const mockRequest = {
      tenantId: tenantDetails.id,
      tenantName: tenantDetails.name,
      headers: {
        tenant: tenantDetails.name,
      },
    };

    // Initialize services with tenant context
    const groupCategoriesService = new GroupCategoriesService(this.connection);
    const groupMembershipService = new GroupsMembershipService(this.connection);
    const contactService: ContactsService = new ContactsService(
      this.connection,
      googleService,
      prisma,
      groupFinderService,
      addressesService,
    );

    // Seed initial data for the new tenant
    // Note: Services need to be updated to use TenantContext or accept tenantId
    await seedService.createAll(
      this.connection,
      contactService,
      jwtHelperService,
      groupsPermissionsService,
      groupCategoriesService,
      googleService,
      groupMembershipService,
    );

    Logger.log(`Tenant setup completed: ${tenantName}`);

    return tenantDetails;
  }
}
