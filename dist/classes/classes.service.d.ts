import { PrismaService } from '../shared/prisma.service';
export declare class ClassesService {
  private prisma;
  constructor(prisma: PrismaService);
  findAll(filters: {
    from?: string;
    to?: string;
    hubId?: string;
    courseId?: string;
    limit: number;
    skip: number;
  }): Promise<any[]>;
  getTimetable(
    studentId?: string,
    contactId?: string,
  ): Promise<
    {
      id: number;
      courseId: number;
      title: string;
      hub: string;
      location: string;
      instructor: string;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      progress: number;
      enrolledAt: Date;
    }[]
  >;
  create(dto: any): Promise<any>;
  getMetricsRaw(
    from?: string,
    to?: string,
  ): Promise<
    {
      id: string;
      categoryId: string;
      attendance: number;
      metaData: {
        tuitionFees: number;
        noOfCertifications: number;
        noOfEnrollments: number;
        noOfInstructors: number;
        totalCourseAttendance: number;
        totalClassAttendance: number;
        totalStudents: number;
      };
    }[]
  >;
}
