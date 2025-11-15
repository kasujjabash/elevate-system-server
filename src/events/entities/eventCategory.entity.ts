import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import GroupEvent from "./event.entity";
import EventField from "./eventField.entity";
import { Tenant } from "../../tenants/entities/tenant.entity";

@Entity()
@Index(["tenantId", "name"], { unique: true })
@Index(["tenantId", "id"])
export default class EventCategory {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  @Index()
  tenantId: number;

  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @Column({ length: 200 })
  name: string;

  @OneToMany((type) => GroupEvent, (it) => it.category, {
    cascade: ["insert", "remove"],
  })
  events: GroupEvent[];

  @OneToMany((type) => EventField, (it) => it.category, {
    cascade: ["insert", "remove"],
  })
  fields: EventField[];
}
