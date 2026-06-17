import { PrismaService } from '../shared/prisma.service';
export declare class DashboardService {
  private prisma;
  constructor(prisma: PrismaService);
  getStats(): Promise<{
    totalStudents: number;
    newThisWeek: number;
    todayClasses: number;
    pendingExams: number;
    totalCourses: number;
    activeEnrollments: number;
    todayAttendance: number;
  }>;
  getHubStats(): Promise<
    {
      hub: string;
      hubCode: string;
      studentCount: number;
      activeCount: number;
      inactive: number;
      presentToday: number;
      absentToday: number;
    }[]
  >;
  getTopPerformers(
    hubId?: number,
    limit?: number,
  ): Promise<{
    topStudents: {
      name: string;
      courseName: string;
      avgGrade: number;
      submissionCount: number;
    }[];
    topCourses: {
      name: string;
      enrolledCount: number;
    }[];
  }>;
  getAllPerformance(opts: {
    hubId?: number;
    courseId?: number;
    instructorContactId?: number;
    limit?: number;
  }): Promise<{
    students: {
      name: string;
      courseName: string;
      hubName: string;
      avgGrade: number;
      submissionCount: number;
    }[];
  }>;
  getSummary(_user: any): Promise<{
    overview: {
      totalStudents: number;
      newThisWeek: number;
      totalCourses: number;
      activeEnrollments: number;
    };
  }>;
  getHubManagerStats(hubId: number): Promise<{
    topStudents: {
      name: string;
      courseName: string;
      avgGrade: number;
      submissionCount: number;
    }[];
    topCourses: {
      name: string;
      enrolledCount: number;
    }[];
    hubId: number;
    hubName: string;
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    totalCourses: number;
    classesToday: number;
    todayAttendance: number;
    courses: {
      id: any;
      name: string;
      enrolled: any;
    }[];
    recentStudents: {
      id: number;
      name: string;
      status: import('.prisma/client').$Enums.student_status_enum;
      course: string;
      enrolledAt: Date;
    }[];
  }>;
  getReportStats(): Promise<{
    studentsByStatus: {
      status: import('.prisma/client').$Enums.student_status_enum;
      count: number;
    }[];
    enrollmentsByStatus: {
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      count: number;
    }[];
    enrollmentsByCourse: {
      course: string;
      count: number;
    }[];
    studentsByHub: {
      hub: string;
      count: number;
    }[];
  }>;
}
