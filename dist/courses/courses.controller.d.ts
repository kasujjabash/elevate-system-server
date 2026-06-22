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
  enroll(
    req: any,
    body: any,
  ): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
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
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
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
  approveEnrollment(id: number): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
    enrolledAt: Date;
    courseId: number;
    completedAt: Date;
    progress: number;
  }>;
  rejectEnrollment(id: number): Promise<{
    id: number;
    studentId: number;
    status: import('.prisma/client').$Enums.enrollment_status_enum;
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
  getCourseResources(id: number): Promise<
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
    id: number,
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
}
