import { DashboardService } from './dashboard.service';
import { CoursesService } from '../courses/courses.service';
export declare class DashboardController {
  private readonly dashboardService;
  private readonly coursesService;
  constructor(
    dashboardService: DashboardService,
    coursesService: CoursesService,
  );
  getStats(): Promise<{
    totalStudents: number;
    newThisWeek: number;
    todayClasses: number;
    pendingExams: number;
    totalCourses: number;
    activeEnrollments: number;
    todayAttendance: number;
    activeStudents: number;
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
    hubId?: string,
    limit?: string,
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
  getAllPerformance(
    req: any,
    hubId?: string,
    courseId?: string,
    limit?: string,
  ): Promise<{
    students: {
      name: string;
      courseName: string;
      hubName: string;
      avgGrade: number;
      submissionCount: number;
    }[];
  }>;
  getSummary(): Promise<{
    overview: {
      totalStudents: number;
      newThisWeek: number;
      totalCourses: number;
      activeEnrollments: number;
    };
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
  getTrainerStats(req: any): Promise<
    | {
        courses: number;
        activeStudents: number;
        classesToday: number;
        todayAttendance: number;
        pendingSubmissions: number;
        liveSessions: any[];
        inactiveStudents?: undefined;
        topStudents?: undefined;
      }
    | {
        courses: number;
        activeStudents: number;
        inactiveStudents: number;
        classesToday: number;
        todayAttendance: number;
        pendingSubmissions: number;
        liveSessions: {
          id: number;
          courseId: number;
          courseName: string;
          hubName: any;
          startTime: string;
          endTime: string;
          room: string;
          isLive: boolean;
        }[];
        topStudents: {
          name: string;
          courseName: string;
          avgGrade: number;
          submissionCount: number;
        }[];
      }
  >;
  getHubManagerStats(req: any): Promise<
    | {
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
      }
    | {
        hubId: any;
        hubName: string;
        totalStudents: number;
        activeStudents: number;
        inactiveStudents: number;
        totalCourses: number;
        classesToday: number;
        todayAttendance: number;
        recentStudents: any[];
      }
  >;
}
