import { PrismaService } from '../shared/prisma.service';
import { CreateCommunityReachDto } from './dto/create-community-reach.dto';
export declare class CommunityReachService {
  private prisma;
  constructor(prisma: PrismaService);
  create(
    dto: CreateCommunityReachDto,
    createdBy?: number,
  ): Promise<
    {
      event: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
    } & {
      phone: string;
      id: number;
      isActive: boolean;
      hubId: number;
      fullName: string;
      createdAt: Date;
      updatedAt: Date;
      eventId: number;
      createdBy: number;
      reachMethod: string;
    }
  >;
  update(
    id: number,
    dto: CreateCommunityReachDto,
  ): Promise<
    {
      event: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
    } & {
      phone: string;
      id: number;
      isActive: boolean;
      hubId: number;
      fullName: string;
      createdAt: Date;
      updatedAt: Date;
      eventId: number;
      createdBy: number;
      reachMethod: string;
    }
  >;
  findAll(filters?: { hubId?: number; reachMethod?: string }): Promise<
    ({
      event: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
    } & {
      phone: string;
      id: number;
      isActive: boolean;
      hubId: number;
      fullName: string;
      createdAt: Date;
      updatedAt: Date;
      eventId: number;
      createdBy: number;
      reachMethod: string;
    })[]
  >;
  findOne(id: number): Promise<
    {
      event: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
    } & {
      phone: string;
      id: number;
      isActive: boolean;
      hubId: number;
      fullName: string;
      createdAt: Date;
      updatedAt: Date;
      eventId: number;
      createdBy: number;
      reachMethod: string;
    }
  >;
  remove(id: number): Promise<{
    phone: string;
    id: number;
    isActive: boolean;
    hubId: number;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
    createdBy: number;
    reachMethod: string;
  }>;
  getStats(): Promise<{
    total: number;
    byReachMethod: Record<string, number>;
    byHub: Record<string, number>;
  }>;
}
