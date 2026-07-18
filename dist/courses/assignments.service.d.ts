import { PrismaService } from '../shared/prisma.service';
export declare class AssignmentsService {
  private prisma;
  constructor(prisma: PrismaService);
  create(dto: {
    courseId: number;
    title: string;
    description?: string;
    dueDate?: string;
    maxScore?: number;
    isMilestone?: boolean;
    isCoursePlayer?: boolean;
    weekNumber?: number;
    hubId?: number;
  }): Promise<
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
      hubId: number;
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
  private emailStudentsAboutNewAssignment;
  private formatAssignment;
  findAll(options?: {
    courseId?: number;
    courseIds?: number[];
  }): Promise<any[]>;
  findAllForTrainer(contactId: number, courseId?: number): Promise<any[]>;
  findByContact(contactId: number): Promise<
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
  findByCourse(courseId: number): Promise<
    ({
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
      hubId: number;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      weekNumber: number;
      dueDate: Date;
      maxScore: number;
      isMilestone: boolean;
      isCoursePlayer: boolean;
    })[]
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
      hubId: number;
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
  submitAssignment(
    assignmentId: number,
    contactId: number,
    body: {
      type?: string;
      content?: string;
      link?: string;
      fileName?: string;
      filePath?: string;
    },
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
  gradeSubmission(
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
        hubId: number;
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
  likeSubmission(submissionId: number): Promise<{
    liked: boolean;
    submissionId: number;
    status: import('.prisma/client').$Enums.submission_status_enum;
  }>;
  approveSubmission(submissionId: number): Promise<
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
        hubId: number;
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
        hubId: number;
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
  getAllSubmissions(filters: {
    status?: string;
    limit?: number;
    courseId?: string;
    instructorContactId?: number;
  }): Promise<
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
        hub: {
          id: number;
          name: string;
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
        hubId: number;
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
  trainerOwnsAssignment(
    contactId: number,
    assignmentId: number,
  ): Promise<boolean>;
  update(
    id: number,
    dto: {
      title?: string;
      description?: string;
      dueDate?: string | null;
      maxScore?: number;
      weekNumber?: number | null;
      hubId?: number | null;
    },
    trainerContactId: number,
    isAdmin: boolean,
  ): Promise<
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
      hubId: number;
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
  getSubmissions(assignmentId: number): Promise<
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
}
