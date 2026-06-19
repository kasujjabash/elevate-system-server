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
        isActive: boolean;
        hubId: number;
        employeeId: string;
        specialization: string;
        createdAt: Date;
        updatedAt: Date;
      };
      _count: {
        enrollments: number;
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
        isActive: boolean;
        hubId: number;
        employeeId: string;
        specialization: string;
        createdAt: Date;
        updatedAt: Date;
      };
      _count: {
        enrollments: number;
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
  }>;
  findAll(): Promise<
    ({
      instructor: {
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
        isActive: boolean;
        hubId: number;
        employeeId: string;
        specialization: string;
        createdAt: Date;
        updatedAt: Date;
      };
      _count: {
        enrollments: number;
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
            firstName: string;
            lastName: string;
            middleName: string;
            gender: import('.prisma/client').$Enums.person_gender_enum;
            avatar: string;
            dateOfBirth: Date;
            contactId: number;
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
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
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
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
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
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  rejectEnrollment(enrollmentId: number): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
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
    instructor: {
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
      isActive: boolean;
      hubId: number;
      employeeId: string;
      specialization: string;
      createdAt: Date;
      updatedAt: Date;
    };
    enrollments: ({
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
    })[];
    study_resources: {
      isPublic: boolean;
      id: number;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      title: string;
      url: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
    }[];
    assignments: {
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
    }[];
    modules: ({
      contents: {
        id: number;
        type: import('.prisma/client').$Enums.module_content_type_enum;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        isPublished: boolean;
        body: string;
        videoUrl: string;
        durationMin: number;
        moduleId: number;
      }[];
    } & {
      id: number;
      title: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      weekNumber: number;
      order: number;
      isPublished: boolean;
    })[];
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
    id: number;
    title: string;
    description: string;
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
    id: number;
    title: string;
    description: string;
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
    id: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    order: number;
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
    id: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    isPublished: boolean;
    body: string;
    videoUrl: string;
    durationMin: number;
    moduleId: number;
  }>;
  deleteContent(contentId: number): Promise<{
    id: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    order: number;
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
        isActive: boolean;
        hubId: number;
        employeeId: string;
        specialization: string;
        createdAt: Date;
        updatedAt: Date;
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
    })[]
  >;
  getCourseResources(courseId: number): Promise<
    {
      isPublic: boolean;
      id: number;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      title: string;
      url: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
    }[]
  >;
  addCourseResource(
    courseId: number,
    dto: any,
  ): Promise<{
    isPublic: boolean;
    id: number;
    type: import('.prisma/client').$Enums.study_resource_type_enum;
    title: string;
    url: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    filePath: string;
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
