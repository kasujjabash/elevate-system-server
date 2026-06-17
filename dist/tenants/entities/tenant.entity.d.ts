import Contact from 'src/crm/entities/contact.entity';
import Help from 'src/help/entities/help.entity';
import Roles from 'src/users/entities/roles.entity';
import { Report } from 'src/reports/entities/report.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Tenant {
  id: number;
  name: string;
  description: string;
  users: User[];
  contacts: Contact[];
  groups: any[];
  groupCategories: any[];
  eventCategories: any[];
  roles: Roles[];
  helpArticles: Help[];
  chatSessions: any[];
  reports: Report[];
}
