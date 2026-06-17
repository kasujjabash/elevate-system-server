import Contact from '../../crm/entities/contact.entity';
import UserRoles from './userRoles.entity';
import { ReportSubmission } from 'src/reports/entities/report.submission.entity';
import { Report } from 'src/reports/entities/report.entity';
import { Tenant } from 'src/tenants/entities/tenant.entity';
export declare class User {
  id: number;
  username: string;
  password: string;
  contact: Contact;
  contactId: number;
  isActive: boolean;
  roles: string;
  hubId: number;
  tokenVersion: number;
  tenant: Tenant;
  userRoles: UserRoles[];
  reportSubmissions: ReportSubmission[];
  reports: Report[];
  hashPassword(): void;
  validatePassword(unencryptedPassword: string): Promise<boolean>;
}
