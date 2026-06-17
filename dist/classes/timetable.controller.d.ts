import { TimetableService, TimetableSessionDto } from './timetable.service';
export declare class TimetableController {
  private readonly timetableService;
  constructor(timetableService: TimetableService);
  getMyTimetable(req: any): Promise<
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
  getTimetable(
    req: any,
    studentId?: string,
    contactId?: string,
    hubId?: string,
    courseId?: string,
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
}
