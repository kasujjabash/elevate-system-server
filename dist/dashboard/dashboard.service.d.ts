import { PrismaService } from '../shared/prisma.service';
import { CommunityReachService } from '../community-reach/community-reach.service';
import { JobPlacementsService } from '../job-placements/job-placements.service';
import { AttendanceService } from '../attendance/attendance.service';
export declare class DashboardService {
  private prisma;
  private communityReachService;
  private jobPlacementsService;
  private attendanceService;
  constructor(
    prisma: PrismaService,
    communityReachService: CommunityReachService,
    jobPlacementsService: JobPlacementsService,
    attendanceService: AttendanceService,
  );
  getStats(): Promise<{
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
  getHubStats(): Promise<
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
  private getTotalContacts;
  private getGenderBreakdown;
  private getCompletionByStatus;
  private getCourseCompletion;
  private getGradeRollup;
  private getActiveStudentsList;
  private getInactiveStudentsList;
  private getRecentlyRegisteredStudents;
  private getPlacementBreakdown;
  private getTotalWagesThisYear;
  getAdminReport(
    hubId?: number,
    courseId?: number,
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
}
