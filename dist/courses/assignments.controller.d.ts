/// <reference types="multer" />
import { AssignmentsService } from './assignments.service';
export declare class AssignmentsController {
  private readonly assignmentsService;
  constructor(assignmentsService: AssignmentsService);
  create(dto: any): Promise<
    {
      course: {
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
    } & {
      id: number;
      title: string;
      description: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      weekNumber: number;
      dueDate: Date;
      maxScore: number;
      isMilestone: boolean;
      isCoursePlayer: boolean;
    }
  >;
  findAll(req: any, contactId?: string, courseId?: string): Promise<any[]>;
  getMyAssignments(req: any): Promise<
    {
      id: number;
      title: string;
      description: string;
      dueDate: Date;
      maxScore: number;
      course: {
        id: number;
        name: string;
      };
      submission: {
        id: any;
        content: any;
        link: any;
        filePath: any;
        score: any;
        feedback: any;
        status: any;
        submittedAt: any;
      };
    }[]
  >;
  getSubmissions(
    id: number,
    req: any,
  ): Promise<
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
      submittedAt: Date;
      status: import('.prisma/client').$Enums.submission_status_enum;
      studentId: number;
      content: string;
      assignmentId: number;
      filePath: string;
      score: number;
      feedback: string;
      gradedAt: Date;
    })[]
  >;
  submit(
    id: number,
    body: any,
    req: any,
  ): Promise<{
    id: number;
    submittedAt: Date;
    status: import('.prisma/client').$Enums.submission_status_enum;
    studentId: number;
    content: string;
    assignmentId: number;
    filePath: string;
    score: number;
    feedback: string;
    gradedAt: Date;
  }>;
  submitFile(
    id: number,
    file: Express.Multer.File,
    req: any,
  ): Promise<{
    id: number;
    submittedAt: Date;
    status: import('.prisma/client').$Enums.submission_status_enum;
    studentId: number;
    content: string;
    assignmentId: number;
    filePath: string;
    score: number;
    feedback: string;
    gradedAt: Date;
  }>;
  grade(
    submissionId: number,
    dto: {
      score: number;
      feedback?: string;
    },
  ): Promise<
    {
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
      assignment: {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: number;
        weekNumber: number;
        dueDate: Date;
        maxScore: number;
        isMilestone: boolean;
        isCoursePlayer: boolean;
      };
    } & {
      id: number;
      submittedAt: Date;
      status: import('.prisma/client').$Enums.submission_status_enum;
      studentId: number;
      content: string;
      assignmentId: number;
      filePath: string;
      score: number;
      feedback: string;
      gradedAt: Date;
    }
  >;
  getAllSubmissions(
    req: any,
    status?: string,
    limit?: string,
    courseId?: string,
    instructorId?: string,
  ): Promise<
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
      assignment: {
        course: {
          id: number;
          title: string;
        };
      } & {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: number;
        weekNumber: number;
        dueDate: Date;
        maxScore: number;
        isMilestone: boolean;
        isCoursePlayer: boolean;
      };
    } & {
      id: number;
      submittedAt: Date;
      status: import('.prisma/client').$Enums.submission_status_enum;
      studentId: number;
      content: string;
      assignmentId: number;
      filePath: string;
      score: number;
      feedback: string;
      gradedAt: Date;
    })[]
  >;
  getFiles(): any[];
  getGrades(): any[];
  gradeByBody(dto: {
    submissionId: number;
    score: number;
    feedback?: string;
  }): Promise<
    {
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
      assignment: {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: number;
        weekNumber: number;
        dueDate: Date;
        maxScore: number;
        isMilestone: boolean;
        isCoursePlayer: boolean;
      };
    } & {
      id: number;
      submittedAt: Date;
      status: import('.prisma/client').$Enums.submission_status_enum;
      studentId: number;
      content: string;
      assignmentId: number;
      filePath: string;
      score: number;
      feedback: string;
      gradedAt: Date;
    }
  >;
  likeSubmission(id: number): Promise<{
    liked: boolean;
    submissionId: number;
    status: import('.prisma/client').$Enums.submission_status_enum;
  }>;
  approveSubmission(id: number): Promise<
    {
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
      assignment: {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        courseId: number;
        weekNumber: number;
        dueDate: Date;
        maxScore: number;
        isMilestone: boolean;
        isCoursePlayer: boolean;
      };
    } & {
      id: number;
      submittedAt: Date;
      status: import('.prisma/client').$Enums.submission_status_enum;
      studentId: number;
      content: string;
      assignmentId: number;
      filePath: string;
      score: number;
      feedback: string;
      gradedAt: Date;
    }
  >;
  findOne(id: number): Promise<
    {
      course: {
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
      submissions: ({
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
        submittedAt: Date;
        status: import('.prisma/client').$Enums.submission_status_enum;
        studentId: number;
        content: string;
        assignmentId: number;
        filePath: string;
        score: number;
        feedback: string;
        gradedAt: Date;
      })[];
    } & {
      id: number;
      title: string;
      description: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      weekNumber: number;
      dueDate: Date;
      maxScore: number;
      isMilestone: boolean;
      isCoursePlayer: boolean;
    }
  >;
}
