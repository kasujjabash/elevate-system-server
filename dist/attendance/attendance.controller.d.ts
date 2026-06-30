import { AttendanceService } from './attendance.service';
import { CreateSessionDto } from './dto/create-session.dto';
export declare class AttendanceController {
  private readonly attendanceService;
  constructor(attendanceService: AttendanceService);
  createSession(
    dto: CreateSessionDto,
    req: any,
  ): Promise<
    {
      course: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
      _count: {
        records: number;
      };
    } & {
      id: number;
      token: string;
      shortCode: string;
      courseId: number;
      hubId: number;
      label: string;
      expiresAt: Date;
      isActive: boolean;
      createdBy: number;
      createdAt: Date;
    }
  >;
  getSessions(
    page?: string,
    limit?: string,
  ): Promise<{
    sessions: ({
      course: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
      _count: {
        records: number;
      };
    } & {
      id: number;
      token: string;
      shortCode: string;
      courseId: number;
      hubId: number;
      label: string;
      expiresAt: Date;
      isActive: boolean;
      createdBy: number;
      createdAt: Date;
    })[];
    total: number;
    page: number;
    limit: number;
  }>;
  getStudentSummary(
    contactId: string,
    days?: string,
  ): Promise<
    {
      date: string;
      count: number;
    }[]
  >;
  getStudentHistory(contactId: string): Promise<
    {
      sessionId: number;
      sessionLabel: string;
      date: string;
      checkedInAt: string;
      course: {
        title: string;
      };
      method: string;
    }[]
  >;
  getSession(id: number): Promise<
    {
      records: ({
        student: {
          id: number;
          studentId: string;
          contact: {
            person: {
              firstName: string;
              lastName: string;
            };
          };
        };
      } & {
        id: number;
        checkedInAt: Date;
        sessionId: number;
        studentId: number;
        method: string;
      })[];
      course: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
    } & {
      id: number;
      token: string;
      shortCode: string;
      courseId: number;
      hubId: number;
      label: string;
      expiresAt: Date;
      isActive: boolean;
      createdBy: number;
      createdAt: Date;
    }
  >;
  closeSession(id: number): Promise<{
    id: number;
    token: string;
    shortCode: string;
    courseId: number;
    hubId: number;
    label: string;
    expiresAt: Date;
    isActive: boolean;
    createdBy: number;
    createdAt: Date;
  }>;
  checkIn(
    token: string,
    req: any,
  ): Promise<{
    success: boolean;
    message: string;
    record: {
      student: {
        studentId: string;
        contact: {
          person: {
            firstName: string;
            lastName: string;
          };
        };
      };
    } & {
      id: number;
      checkedInAt: Date;
      sessionId: number;
      studentId: number;
      method: string;
    };
    session: {
      id: number;
      label: string;
    };
  }>;
  checkInByCode(
    body: {
      code: string;
    },
    req: any,
  ): Promise<{
    success: boolean;
    message: string;
    record: {
      student: {
        studentId: string;
        contact: {
          person: {
            firstName: string;
            lastName: string;
          };
        };
      };
    } & {
      id: number;
      checkedInAt: Date;
      sessionId: number;
      studentId: number;
      method: string;
    };
    session: {
      id: number;
      label: string;
    };
  }>;
  getSessionByToken(token: string): Promise<
    {
      course: {
        id: number;
        title: string;
      };
      hub: {
        id: number;
        name: string;
      };
      _count: {
        records: number;
      };
    } & {
      id: number;
      token: string;
      shortCode: string;
      courseId: number;
      hubId: number;
      label: string;
      expiresAt: Date;
      isActive: boolean;
      createdBy: number;
      createdAt: Date;
    }
  >;
  getStats(
    hubId?: string,
    courseId?: string,
  ): Promise<{
    enrolled: number;
    presentLastSession: number;
    absentLastSession: number;
    inactive: number;
    lastSessionDate: string;
    daysAgo: number;
    isToday: boolean;
  }>;
  addManual(
    id: number,
    body: {
      studentId: number;
    },
  ): Promise<{
    id: number;
    checkedInAt: Date;
    sessionId: number;
    studentId: number;
    method: string;
  }>;
}
