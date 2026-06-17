import { URLCategory } from '../enums/URLCategory';
import { Tenant } from '../../tenants/entities/tenant.entity';
export default class Help {
  id: number;
  tenant: Tenant;
  title: string;
  url?: string;
  category: URLCategory;
  createdOn: Date;
  modifiedOn: Date;
}
