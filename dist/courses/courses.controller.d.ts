import { CoursesService } from './courses.service';
export declare class CoursesController {
  private readonly coursesService;
  constructor(coursesService: CoursesService);
  findAllRoot(
    req: any,
    hub?: string,
    isActive?: string,
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
  createRoot(dto: any): Promise<
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
  findAll(
    req: any,
    hub?: string,
    isActive?: string,
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
  getEnrollments(
    contactId?: string,
    groupId?: string,
    courseId?: string,
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
  enroll(
    req: any,
    body: any,
  ): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  enrollById(
    req: any,
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
  adminEnroll(
    req: any,
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
  approveEnrollment(id: number): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  rejectEnrollment(id: number): Promise<{
    id: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    studentId: number;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  combo(): Promise<
    {
      id: string;
      name: string;
    }[]
  >;
  coursesCombo(): Promise<
    {
      id: string;
      name: string;
    }[]
  >;
  courseReports(): Promise<
    {
      id: string;
      name: string;
      hub: string;
      enrolledCount: number;
      isActive: boolean;
      isEnrollable: boolean;
    }[]
  >;
  reportFrequency(): any[];
  courseRequests(): any[];
  getCategories(): any[];
  getInstructors(): Promise<
    {
      id: number;
      contactId: number;
      name: string;
    }[]
  >;
  getContent(
    contentId: number,
    req: any,
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
  markComplete(
    contentId: number,
    req: any,
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
  getModule(
    moduleId: number,
    req: any,
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
  updateModule(
    moduleId: number,
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
  getCourseModules(
    id: number,
    req: any,
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
  getCourseProgress(
    id: number,
    req: any,
  ): Promise<{
    courseId: number;
    studentId: number;
    progress: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    completedContentIds: number[];
  }>;
  createModule(
    id: number,
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
  getCourseResources(id: number): Promise<
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
    id: number,
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
    id: number,
    resourceId: number,
  ): Promise<{
    success: boolean;
  }>;
  getCourseTrainerStats(id: number): Promise<{
    activeStudents: number;
    classesToday: number;
    todayAttendance: number;
    pendingSubmissions: number;
    topStudents: {
      name: string;
      avgGrade: number;
    }[];
  }>;
  assignInstructor(
    id: number,
    dto: {
      instructorId: number;
    },
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
}
