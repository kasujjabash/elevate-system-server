import { PrismaService } from '../shared/prisma.service';
export declare class AnnouncementsService {
  private prisma;
  constructor(prisma: PrismaService);
  findActive(): Promise<
    {
      id: number;
      type: string;
      title: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      expiresAt: Date;
      createdBy: number;
      body: string;
      pinned: boolean;
    }[]
  >;
  findAll(): Promise<
    {
      id: number;
      type: string;
      title: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      expiresAt: Date;
      createdBy: number;
      body: string;
      pinned: boolean;
    }[]
  >;
  create(
    dto: {
      title: string;
      body: string;
      type?: string;
      pinned?: boolean;
      expiresAt?: string;
    },
    createdBy?: number,
  ): Promise<{
    id: number;
    type: string;
    title: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    createdBy: number;
    body: string;
    pinned: boolean;
  }>;
  setActive(
    id: number,
    isActive: boolean,
  ): Promise<{
    id: number;
    type: string;
    title: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    createdBy: number;
    body: string;
    pinned: boolean;
  }>;
  remove(id: number): Promise<{
    id: number;
    type: string;
    title: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    createdBy: number;
    body: string;
    pinned: boolean;
  }>;
  getUpcomingEvents(days?: number): Promise<
    {
      id: number;
      type: string;
      title: string;
      description: string;
      isActive: boolean;
      location: string;
      createdAt: Date;
      endDate: Date;
      createdBy: number;
      eventDate: Date;
    }[]
  >;
  getAllEvents(): Promise<
    {
      id: number;
      type: string;
      title: string;
      description: string;
      isActive: boolean;
      location: string;
      createdAt: Date;
      endDate: Date;
      createdBy: number;
      eventDate: Date;
    }[]
  >;
  createEvent(
    dto: {
      title: string;
      description?: string;
      eventDate: string;
      endDate?: string;
      location?: string;
      type?: string;
    },
    createdBy?: number,
  ): Promise<{
    id: number;
    type: string;
    title: string;
    description: string;
    isActive: boolean;
    location: string;
    createdAt: Date;
    endDate: Date;
    createdBy: number;
    eventDate: Date;
  }>;
  removeEvent(id: number): Promise<{
    id: number;
    type: string;
    title: string;
    description: string;
    isActive: boolean;
    location: string;
    createdAt: Date;
    endDate: Date;
    createdBy: number;
    eventDate: Date;
  }>;
}
