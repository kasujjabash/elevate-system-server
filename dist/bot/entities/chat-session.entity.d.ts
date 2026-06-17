import { ChatNode } from './chat-node.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
export declare class ChatSession {
  id: number;
  tenant: Tenant;
  createdAt: Date;
  phone: string;
  userPath: string;
  language: string;
  isActive: boolean;
  sessionId: string;
  nodes: ChatNode[];
  metaData: any;
}
