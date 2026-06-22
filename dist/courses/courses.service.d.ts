import { PrismaService } from '../shared/prisma.service';
export declare class CoursesService {
  private prisma;
  constructor(prisma: PrismaService);
  create(dto: any): Promise<
    {
      instructor: {
        contact: {
          person: {
            id: number;
            contactId: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        contactId: number;
        specialization: string;
      };
      _count: {
        enrollments: number;
      };
    } & {
      title: string;
      description: string;
      maxStudents: number;
      duration: string;
      isEnrollable: boolean;
      instructorId: number;
      id: number;
      isActive: boolean;
      hubId: number;
      skillCategoryId: string;
      createdAt: Date;
      updatedAt: Date;
    }
  >;
  update(
    id: number,
    dto: any,
  ): Promise<
    {
      instructor: {
        contact: {
          person: {
            id: number;
            contactId: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        contactId: number;
        specialization: string;
      };
      _count: {
        enrollments: number;
      };
    } & {
      title: string;
      description: string;
      maxStudents: number;
      duration: string;
      isEnrollable: boolean;
      instructorId: number;
      id: number;
      isActive: boolean;
      hubId: number;
      skillCategoryId: string;
      createdAt: Date;
      updatedAt: Date;
    }
  >;
  getInstructors(): Promise<
    {
      id: number;
      contactId: number;
      name: string;
    }[]
  >;
  updateInstructor(
    courseId: number,
    instructorId: number,
  ): Promise<{
    title: string;
    description: string;
    maxStudents: number;
    duration: string;
    isEnrollable: boolean;
    instructorId: number;
    id: number;
    isActive: boolean;
    hubId: number;
    skillCategoryId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  findAll(): Promise<
    ({
      instructor: {
        contact: {
          person: {
            id: number;
            contactId: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        contactId: number;
        specialization: string;
      };
      _count: {
        enrollments: number;
      };
    } & {
      title: string;
      description: string;
      maxStudents: number;
      duration: string;
      isEnrollable: boolean;
      instructorId: number;
      id: number;
      isActive: boolean;
      hubId: number;
      skillCategoryId: string;
      createdAt: Date;
      updatedAt: Date;
    })[]
  >;
  findAllForClient(
    _hub?: string,
    isActive?: string,
    instructorContactId?: number,
  ): Promise<
    {
      id: number;
      name: string;
      title: string;
      description: string;
      duration: string;
      capacity: number;
      enrolledCount: number;
      isActive: boolean;
      isEnrollable: boolean;
      instructorId: number;
      instructor: string;
      instructorSpecialization: string;
    }[]
  >;
  getCombo(): Promise<
    {
      id: string;
      name: string;
    }[]
  >;
  resolveStudentId(input: any): Promise<number | null>;
  getEnrollments(
    contactId?: string,
    groupId?: string,
  ): Promise<
    {
      id: string;
      courseId: string;
      course: {
        id: string;
        name: string;
        title: string;
      };
      courseName: string;
      hubName: string;
      status: string;
      progress: number;
      avgGrade: number;
      submissionCount: number;
      enrolledAt: Date;
      contactId: string;
      studentId: string;
      firstName: string;
      lastName: string;
      email: any;
      phone: any;
      student: {
        id: number;
        contactId: number;
        contact: {
          person: {
            id: number;
            contactId: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
          };
          email: any;
          phone: any;
        };
      };
    }[]
  >;
  enrollStudent(body: {
    studentId?: string;
    courseId?: string;
    groupId?: string;
    contactId?: string;
    hubId?: string;
  }): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  adminEnrollStudent(
    courseId: number,
    body: {
      studentId?: string;
      contactId?: string;
    },
  ): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  getPendingEnrollments(): Promise<
    {
      id: number;
      studentId: number;
      courseId: number;
      studentName: string;
      courseName: string;
      requestedAt: Date;
    }[]
  >;
  approveEnrollment(enrollmentId: number): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  rejectEnrollment(enrollmentId: number): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  getCourseReports(): Promise<
    {
      id: string;
      name: string;
      hub: string;
      enrolledCount: number;
      isActive: boolean;
      isEnrollable: boolean;
    }[]
  >;
  findOne(id: number): Promise<{
    name: string;
    enrolledCount: number;
    hub: {
      description: string;
      id: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      address: string;
      capacity: number;
      code: string;
      location: string;
      managerName: string;
      managerPhone: string;
      managerEmail: string;
      computers: number;
      projectors: number;
      notes: string;
    };
    instructor: {
      contact: {
        person: {
          id: number;
          contactId: number;
          firstName: string;
          lastName: string;
          middleName: string;
          gender: import('.prisma/client').$Enums.person_gender_enum;
          avatar: string;
          dateOfBirth: Date;
        };
      } & {
        id: number;
        category: 'Person';
      };
    } & {
      id: number;
      isActive: boolean;
      hubId: number;
      createdAt: Date;
      updatedAt: Date;
      employeeId: string;
      contactId: number;
      specialization: string;
    };
    enrollments: ({
      student: {
        contact: {
          person: {
            id: number;
            contactId: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        contactId: number;
        studentId: string;
        status: import('.prisma/client').$Enums.student_status_enum;
        enrolledAt: Date;
      };
    } & {
      id: number;
      studentId: number;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      enrolledAt: Date;
      courseId: number;
      completedAt: Date;
      progress: number;
    })[];
    study_resources: {
      title: string;
      description: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      url: string;
      isPublic: boolean;
    }[];
    assignments: {
      title: string;
      description: string;
      id: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      dueDate: Date;
      maxScore: number;
      weekNumber: number;
      isMilestone: boolean;
      isCoursePlayer: boolean;
    }[];
    modules: ({
      contents: {
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        type: import('.prisma/client').$Enums.module_content_type_enum;
        isPublished: boolean;
        body: string;
        videoUrl: string;
        durationMin: number;
        moduleId: number;
      }[];
    } & {
      title: string;
      description: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      weekNumber: number;
      order: number;
      isPublished: boolean;
    })[];
    title: string;
    description: string;
    maxStudents: number;
    duration: string;
    isEnrollable: boolean;
    instructorId: number;
    id: number;
    isActive: boolean;
    hubId: number;
    skillCategoryId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  getStudentCourses(studentId: number): Promise<
    {
      enrollmentId: number;
      courseId: number;
      title: string;
      description: string;
      hub: string;
      progress: number;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      enrolledAt: Date;
      totalModules: number;
      totalLessons: number;
    }[]
  >;
  getCourseModules(
    courseId: number,
    studentId?: number,
  ): Promise<
    {
      id: number;
      title: string;
      description: string;
      weekNumber: number;
      order: number;
      contentCount: number;
      completedCount: number;
      contents: {
        id: any;
        title: any;
        type: any;
        order: any;
        durationMin: any;
        completed: boolean;
      }[];
    }[]
  >;
  getModule(
    moduleId: number,
    studentId?: number,
  ): Promise<{
    id: number;
    courseId: number;
    courseTitle: any;
    title: string;
    description: string;
    weekNumber: number;
    contents: {
      id: any;
      title: any;
      body: any;
      videoUrl: any;
      type: any;
      order: any;
      durationMin: any;
      completed: boolean;
    }[];
  }>;
  getContent(
    contentId: number,
    studentId?: number,
  ): Promise<{
    id: number;
    moduleId: number;
    weekNumber: any;
    courseId: any;
    courseTitle: any;
    title: string;
    body: string;
    videoUrl: string;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    durationMin: number;
    completed: boolean;
  }>;
  markContentComplete(
    contentId: number,
    studentId: number,
  ): Promise<
    | {
        alreadyCompleted: boolean;
        completed?: undefined;
      }
    | {
        completed: boolean;
        alreadyCompleted?: undefined;
      }
  >;
  getCourseProgress(
    courseId: number,
    studentId: number,
  ): Promise<{
    courseId: number;
    studentId: number;
    progress: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    completedContentIds: number[];
  }>;
  createModule(
    courseId: number,
    dto: any,
  ): Promise<{
    title: string;
    description: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    weekNumber: number;
    order: number;
    isPublished: boolean;
  }>;
  updateModule(
    moduleId: number,
    dto: {
      title?: string;
      description?: string;
    },
  ): Promise<{
    title: string;
    description: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    weekNumber: number;
    order: number;
    isPublished: boolean;
  }>;
  createContent(
    moduleId: number,
    dto: any,
  ): Promise<{
    title: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    isPublished: boolean;
    body: string;
    videoUrl: string;
    durationMin: number;
    moduleId: number;
  }>;
  updateContent(
    contentId: number,
    dto: any,
  ): Promise<{
    title: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    isPublished: boolean;
    body: string;
    videoUrl: string;
    durationMin: number;
    moduleId: number;
  }>;
  deleteContent(contentId: number): Promise<{
    title: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    isPublished: boolean;
    body: string;
    videoUrl: string;
    durationMin: number;
    moduleId: number;
  }>;
  findByHub(hubId: number): Promise<
    ({
      instructor: {
        contact: {
          person: {
            id: number;
            contactId: number;
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
          };
        } & {
          id: number;
          category: 'Person';
        };
      } & {
        id: number;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        contactId: number;
        specialization: string;
      };
    } & {
      title: string;
      description: string;
      maxStudents: number;
      duration: string;
      isEnrollable: boolean;
      instructorId: number;
      id: number;
      isActive: boolean;
      hubId: number;
      skillCategoryId: string;
      createdAt: Date;
      updatedAt: Date;
    })[]
  >;
  getCourseResources(courseId: number): Promise<
    {
      title: string;
      description: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      url: string;
      isPublic: boolean;
    }[]
  >;
  addCourseResource(
    courseId: number,
    dto: any,
  ): Promise<{
    title: string;
    description: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    filePath: string;
    type: import('.prisma/client').$Enums.study_resource_type_enum;
    url: string;
    isPublic: boolean;
  }>;
  removeCourseResource(
    courseId: number,
    resourceId: number,
  ): Promise<{
    success: boolean;
  }>;
  getCourseTrainerStats(courseId: number): Promise<{
    activeStudents: number;
    classesToday: number;
    todayAttendance: number;
    pendingSubmissions: number;
    topStudents: {
      name: string;
      avgGrade: number;
    }[];
  }>;
  getTrainerStats(contactId: number): Promise<
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
}
