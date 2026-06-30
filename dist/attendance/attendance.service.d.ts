import { PrismaService } from '../shared/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
export declare class AttendanceService {
  private prisma;
  constructor(prisma: PrismaService);
  private generateShortCode;
  createSession(
    dto: CreateSessionDto,
    createdBy: number,
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
    page?: number,
    limit?: number,
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
    contactId: number,
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
    code: string,
    contactId: number,
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
  addManual(
    sessionId: number,
    studentDbId: number,
  ): Promise<{
    id: number;
    checkedInAt: Date;
    sessionId: number;
    studentId: number;
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
