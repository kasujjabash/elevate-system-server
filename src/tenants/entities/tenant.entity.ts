import Contact from 'src/crm/entities/contact.entity';
import Help from 'src/help/entities/help.entity';
import Roles from 'src/users/entities/roles.entity';
import { Report } from 'src/reports/entities/report.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Contact, (contact) => contact.tenant)
  contacts: Contact[];

  groups: any[];
  groupCategories: any[];
  eventCategories: any[];

  @OneToMany(() => Roles, (role) => role.tenant)
  roles: Roles[];

  @OneToMany(() => Help, (help) => help.tenant)
  helpArticles: Help[];

  chatSessions: any[];

  @OneToMany(() => Report, (report) => report.tenant)
  reports: Report[];
}
