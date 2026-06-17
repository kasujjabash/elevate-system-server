import UserRoles from './userRoles.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
export default class Roles {
  id: number;
  tenant: Tenant;
  role: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdOn: Date;
  modifiedOn: Date;
  rolesUser: UserRoles[];
}
