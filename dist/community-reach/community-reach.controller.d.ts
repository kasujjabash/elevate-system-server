import { CommunityReachService } from './community-reach.service';
import { CreateCommunityReachDto } from './dto/create-community-reach.dto';
export declare class CommunityReachController {
  private readonly communityReachService;
  constructor(communityReachService: CommunityReachService);
  findAll(
    hubId?: string,
    reachMethod?: string,
  ): Promise<
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
  getStats(): Promise<{
    total: number;
    byReachMethod: Record<string, number>;
    byHub: Record<string, number>;
  }>;
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
  create(
    dto: CreateCommunityReachDto,
    req: any,
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
    req: any,
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
  remove(
    id: number,
    req: any,
  ): Promise<{
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
}
