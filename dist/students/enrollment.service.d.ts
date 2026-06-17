import { PrismaService } from '../shared/prisma.service';
export declare class EnrollmentService {
  private prisma;
  constructor(prisma: PrismaService);
  enrollStudent(
    studentId: number,
    courseId: number,
  ): Promise<
    {
      course: {
        hub: {
          address: string;
          id: number;
          name: string;
          description: string;
          isActive: boolean;
          location: string;
          createdAt: Date;
          updatedAt: Date;
          code: string;
          managerName: string;
          managerPhone: string;
          managerEmail: string;
          computers: number;
          projectors: number;
          capacity: number;
          notes: string;
        };
        skillCategory: {
          id: string;
          name: string;
          description: string;
        };
      } & {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        isEnrollable: boolean;
        maxStudents: number;
        instructorId: number;
        skillCategoryId: string;
      };
      student: {
        contact: {
          person: {
            id: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
            contactId: number;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        contactId: number;
        status: import('.prisma/client').$Enums.student_status_enum;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        enrolledAt: Date;
      };
    } & {
      id: number;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      studentId: number;
      enrolledAt: Date;
      courseId: number;
      completedAt: Date;
      progress: number;
    }
  >;
  updateEnrollmentProgress(
    studentId: number,
    courseId: number,
    progress: number,
  ): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  completeEnrollment(
    studentId: number,
    courseId: number,
  ): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  dropEnrollment(
    studentId: number,
    courseId: number,
  ): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  getEnrollmentsByCourse(courseId: number): Promise<
    ({
      student: {
        contact: {
          person: {
            id: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
            contactId: number;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        contactId: number;
        status: import('.prisma/client').$Enums.student_status_enum;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        enrolledAt: Date;
      };
    } & {
      id: number;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      studentId: number;
      enrolledAt: Date;
      courseId: number;
      completedAt: Date;
      progress: number;
    })[]
  >;
}
