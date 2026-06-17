import { PrismaService } from '../shared/prisma.service';
export interface TimetableSessionDto {
  courseId: number;
  hubId?: number | null;
  instructorName?: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  meetLink?: string | null;
}
export declare class TimetableService {
  private prisma;
  constructor(prisma: PrismaService);
  private isLiveNow;
  private toResponse;
  private get include();
  findAll(filters: { hubId?: string; courseId?: string }): Promise<
    {
      id: any;
      dayOfWeek: any;
      startTime: any;
      endTime: any;
      room: any;
      meetLink: any;
      courseId: any;
      courseName: any;
      moduleCode: any;
      hubId: any;
      hubName: any;
      instructorName: any;
      isToday: boolean;
      isLive: boolean;
    }[]
  >;
  findAllScoped(
    filters: {
      hubId?: string;
      courseId?: string;
    },
    jwtUser: any,
  ): Promise<
    {
      id: any;
      dayOfWeek: any;
      startTime: any;
      endTime: any;
      room: any;
      meetLink: any;
      courseId: any;
      courseName: any;
      moduleCode: any;
      hubId: any;
      hubName: any;
      instructorName: any;
      isToday: boolean;
      isLive: boolean;
    }[]
  >;
  findForJwtUser(jwtUser: any): Promise<
    {
      id: any;
      dayOfWeek: any;
      startTime: any;
      endTime: any;
      room: any;
      meetLink: any;
      courseId: any;
      courseName: any;
      moduleCode: any;
      hubId: any;
      hubName: any;
      instructorName: any;
      isToday: boolean;
      isLive: boolean;
    }[]
  >;
  findForStudent(studentIdOrUserId: string): Promise<
    {
      id: any;
      dayOfWeek: any;
      startTime: any;
      endTime: any;
      room: any;
      meetLink: any;
      courseId: any;
      courseName: any;
      moduleCode: any;
      hubId: any;
      hubName: any;
      instructorName: any;
      isToday: boolean;
      isLive: boolean;
    }[]
  >;
  create(dto: TimetableSessionDto): Promise<{
    id: any;
    dayOfWeek: any;
    startTime: any;
    endTime: any;
    room: any;
    meetLink: any;
    courseId: any;
    courseName: any;
    moduleCode: any;
    hubId: any;
    hubName: any;
    instructorName: any;
    isToday: boolean;
    isLive: boolean;
  }>;
  update(
    id: number,
    dto: Partial<TimetableSessionDto>,
  ): Promise<{
    id: any;
    dayOfWeek: any;
    startTime: any;
    endTime: any;
    room: any;
    meetLink: any;
    courseId: any;
    courseName: any;
    moduleCode: any;
    hubId: any;
    hubName: any;
    instructorName: any;
    isToday: boolean;
    isLive: boolean;
  }>;
  remove(id: number): Promise<{
    success: boolean;
  }>;
  countToday(): Promise<number>;
}
