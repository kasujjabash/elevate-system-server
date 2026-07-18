import { DashboardService } from './dashboard.service';
import { CoursesService } from '../courses/courses.service';
export declare class DashboardController {
  private readonly dashboardService;
  private readonly coursesService;
  constructor(
    dashboardService: DashboardService,
    coursesService: CoursesService,
  );
  private assertStaffAccess;
  getStats(req: any): Promise<{
    totalStudents: number;
    newThisWeek: number;
    todayClasses: number;
    pendingExams: number;
    totalCourses: number;
    activeEnrollments: number;
    todayAttendance: number;
    attendanceInfo: {
      presentCount: number;
      date: string;
      daysAgo: number;
      isToday: boolean;
    };
    activeStudents: number;
  }>;
  getHubStats(req: any): Promise<
    {
      hub: string;
      hubCode: string;
      studentCount: number;
      activeCount: number;
      inactive: number;
      presentToday: number;
      absentToday: number;
      attendanceInfo: {
        presentCount: number;
        date: string;
        daysAgo: number;
        isToday: boolean;
      };
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
  getSummary(req: any): Promise<{
    overview: {
      totalStudents: number;
      newThisWeek: number;
      totalCourses: number;
      activeEnrollments: number;
    };
  }>;
  getReportStats(req: any): Promise<{
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
  getAdminReport(
    req: any,
    hubId?: string,
    courseId?: string,
  ): Promise<{
    totals: {
      totalStudents: number;
      totalCourses: number;
      activeEnrollments: number;
      activeStudents: number;
      totalContacts: number;
      totalCommunityReach: number;
      totalYouthReached: number;
      totalJobPlacements: number;
      totalWagesThisYear: number;
    };
    activeStudentsList: {
      id: number;
      name: string;
      hub: string;
      course: string;
    }[];
    inactiveStudentsList: {
      id: number;
      name: string;
      hub: string;
      course: string;
    }[];
    attendance: {
      byHub: {
        hub: string;
        hubCode: string;
        presentToday: number;
        absentToday: number;
      }[];
      enrolled: number;
      presentLastSession: number;
      absentLastSession: number;
      inactive: number;
      lastSessionDate: string;
      daysAgo: number;
      isToday: boolean;
    };
    hubs: {
      hub: string;
      hubCode: string;
      studentCount: number;
      activeCount: number;
      inactive: number;
      presentToday: number;
      absentToday: number;
      attendanceInfo: {
        presentCount: number;
        date: string;
        daysAgo: number;
        isToday: boolean;
      };
    }[];
    enrollment: {
      byCourse: {
        course: string;
        count: number;
      }[];
      byStatus: {
        status: import('.prisma/client').$Enums.enrollment_status_enum;
        count: number;
      }[];
      byHub: {
        hub: string;
        count: number;
      }[];
    };
    completion: {
      byStudentStatus: {
        status: import('.prisma/client').$Enums.student_status_enum;
        count: number;
      }[];
      byCourse: {
        courseId: number;
        courseName: string;
        totalEnrolled: number;
        completedCount: number;
        completionRate: number;
        avgProgress: number;
      }[];
    };
    performance: {
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
      allStudents: {
        name: string;
        courseName: string;
        hubName: string;
        avgGrade: number;
        submissionCount: number;
      }[];
      byCourse: {
        courseId: number;
        courseName: string;
        avgGrade: number;
        submissionCount: number;
      }[];
    };
    jobPlacements: {
      genderBreakdown: {
        gender: string;
        count: number;
      }[];
      recentlyPlaced: {
        id: number;
        name: string;
        placementType: string;
        jobTitle: string;
        companyName: string;
        course: string;
        hub: string;
        createdAt: Date;
      }[];
      total: number;
      byType: Record<string, number>;
      avgSalaryChangeAmount: number;
      avgSalaryChangePercent: number;
      recordsWithSalaryData: number;
    };
    communityReach: {
      total: number;
      byReachMethod: Record<string, number>;
      byHub: Record<string, number>;
    };
    demographics: {
      gender: {
        gender: import('.prisma/client').$Enums.person_gender_enum;
        count: number;
      }[];
    };
    recentStudents: {
      id: number;
      name: string;
      hub: string;
      status: import('.prisma/client').$Enums.student_status_enum;
      createdAt: Date;
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
        attendanceInfo: {
          presentCount: number;
          date: string;
          daysAgo: number;
          isToday: boolean;
        };
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
