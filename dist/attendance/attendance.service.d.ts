import { PrismaService } from '../shared/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
export declare class AttendanceService {
  private prisma;
  constructor(prisma: PrismaService);
  private generateShortCode;
  private assertCanCreateSession;
  createSession(
    dto: CreateSessionDto,
    createdBy: number,
    requester: {
      roles: string[];
      contactId?: number;
    },
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
    page?: number,
    limit?: number,
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
    contactId: number,
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
    code: string,
    contactId: number,
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
  addManual(
    sessionId: number,
    studentDbId: number,
  ): Promise<{
    id: number;
    studentId: number;
    checkedInAt: Date;
    sessionId: number;
    method: string;
  }>;
  getStudentSummary(
    contactId: string,
    days?: number,
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
  getStats(
    hubId?: number,
    courseId?: number,
  ): Promise<{
    enrolled: number;
    presentLastSession: number;
    absentLastSession: number;
    inactive: number;
    lastSessionDate: string;
    daysAgo: number;
    isToday: boolean;
  }>;
  getHubAttendanceStats(): Promise<{
    presentMap: Map<number, number>;
    inactiveMap: Map<number, number>;
  }>;
}
