import { AnnouncementsService } from './announcements.service';
export declare class AnnouncementsController {
  private readonly svc;
  constructor(svc: AnnouncementsService);
  findAll(all?: string): Promise<
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
    dto: any,
    req: any,
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
  toggle(
    id: number,
    body: {
      isActive: boolean;
    },
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
  getEvents(all?: string): Promise<
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
    dto: any,
    req: any,
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
