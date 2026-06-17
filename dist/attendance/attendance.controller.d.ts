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
      hub: {
        id: number;
        name: string;
      };
      course: {
        id: number;
        title: string;
      };
      _count: {
        records: number;
      };
    } & {
      id: number;
      isActive: boolean;
      label: string;
      hubId: number;
      createdAt: Date;
      courseId: number;
      token: string;
      shortCode: string;
      expiresAt: Date;
      createdBy: number;
    }
  >;
  getSessions(
    page?: string,
    limit?: string,
  ): Promise<{
    sessions: ({
      hub: {
        id: number;
        name: string;
      };
      course: {
        id: number;
        title: string;
      };
      _count: {
        records: number;
      };
    } & {
      id: number;
      isActive: boolean;
      label: string;
      hubId: number;
      createdAt: Date;
      courseId: number;
      token: string;
      shortCode: string;
      expiresAt: Date;
      createdBy: number;
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
      hub: {
        id: number;
        name: string;
      };
      course: {
        id: number;
        title: string;
      };
      records: ({
        student: {
          contact: {
            person: {
              firstName: string;
              lastName: string;
            };
          };
          id: number;
          studentId: string;
        };
      } & {
        id: number;
        studentId: number;
        checkedInAt: Date;
        sessionId: number;
        method: string;
      })[];
    } & {
      id: number;
      isActive: boolean;
      label: string;
      hubId: number;
      createdAt: Date;
      courseId: number;
      token: string;
      shortCode: string;
      expiresAt: Date;
      createdBy: number;
    }
  >;
  closeSession(id: number): Promise<{
    id: number;
    isActive: boolean;
    label: string;
    hubId: number;
    createdAt: Date;
    courseId: number;
    token: string;
    shortCode: string;
    expiresAt: Date;
    createdBy: number;
  }>;
  checkIn(
    token: string,
    req: any,
  ): Promise<{
    success: boolean;
    message: string;
    record: {
      student: {
        contact: {
          person: {
            firstName: string;
            lastName: string;
          };
        };
        studentId: string;
      };
    } & {
      id: number;
      studentId: number;
      checkedInAt: Date;
      sessionId: number;
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
        contact: {
          person: {
            firstName: string;
            lastName: string;
          };
        };
        studentId: string;
      };
    } & {
      id: number;
      studentId: number;
      checkedInAt: Date;
      sessionId: number;
      method: string;
    };
    session: {
      id: number;
      label: string;
    };
  }>;
  getSessionByToken(token: string): Promise<
    {
      hub: {
        id: number;
        name: string;
      };
      course: {
        id: number;
        title: string;
      };
      _count: {
        records: number;
      };
    } & {
      id: number;
      isActive: boolean;
      label: string;
      hubId: number;
      createdAt: Date;
      courseId: number;
      token: string;
      shortCode: string;
      expiresAt: Date;
      createdBy: number;
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
  }>;
  addManual(
    id: number,
    body: {
      studentId: number;
    },
  ): Promise<{
    id: number;
    studentId: number;
    checkedInAt: Date;
    sessionId: number;
    method: string;
  }>;
}
