import { PrismaService } from '../shared/prisma.service';
export declare class StudentsService {
  private prisma;
  constructor(prisma: PrismaService);
  create(createStudentDto: any): Promise<
    {
      contact: {
        address: {
          id: number;
          contactId: number;
          category: import('.prisma/client').$Enums.address_category_enum;
          isPrimary: boolean;
          country: string;
          district: string;
          freeForm: string;
          latitude: number;
          longitude: number;
          placeId: string;
        }[];
        email: {
          id: number;
          contactId: number;
          category: import('.prisma/client').$Enums.email_category_enum;
          value: string;
          isPrimary: boolean;
        }[];
        phone: {
          id: number;
          contactId: number;
          category: import('.prisma/client').$Enums.phone_category_enum;
          value: string;
          isPrimary: boolean;
        }[];
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
        address: string;
        id: number;
        name: string;
        description: string;
        isActive: boolean;
        location: string;
        code: string;
        managerName: string;
        managerPhone: string;
        managerEmail: string;
        computers: number;
        projectors: number;
        capacity: number;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
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
    }
  >;
  findAll(): Promise<
    ({
      contact: {
        email: {
          id: number;
          contactId: number;
          category: import('.prisma/client').$Enums.email_category_enum;
          value: string;
          isPrimary: boolean;
        }[];
        phone: {
          id: number;
          contactId: number;
          category: import('.prisma/client').$Enums.phone_category_enum;
          value: string;
          isPrimary: boolean;
        }[];
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
        address: string;
        id: number;
        name: string;
        description: string;
        isActive: boolean;
        location: string;
        code: string;
        managerName: string;
        managerPhone: string;
        managerEmail: string;
        computers: number;
        projectors: number;
        capacity: number;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
      };
      enrollments: ({
        course: {
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
      } & {
        id: number;
        status: import('.prisma/client').$Enums.enrollment_status_enum;
        studentId: number;
        enrolledAt: Date;
        courseId: number;
        completedAt: Date;
        progress: number;
      })[];
    } & {
      id: number;
      contactId: number;
      status: import('.prisma/client').$Enums.student_status_enum;
      hubId: number;
      createdAt: Date;
      updatedAt: Date;
      studentId: string;
      enrolledAt: Date;
    })[]
  >;
  findByHub(hubId: number): Promise<
    ({
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
      enrollments: ({
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
        status: import('.prisma/client').$Enums.enrollment_status_enum;
        studentId: number;
        enrolledAt: Date;
        courseId: number;
        completedAt: Date;
        progress: number;
      })[];
    } & {
      id: number;
      contactId: number;
      status: import('.prisma/client').$Enums.student_status_enum;
      hubId: number;
      createdAt: Date;
      updatedAt: Date;
      studentId: string;
      enrolledAt: Date;
    })[]
  >;
  findOne(id: number): Promise<{
    userId: number;
    contact: {
      address: {
        id: number;
        contactId: number;
        category: import('.prisma/client').$Enums.address_category_enum;
        isPrimary: boolean;
        country: string;
        district: string;
        freeForm: string;
        latitude: number;
        longitude: number;
        placeId: string;
      }[];
      email: {
        id: number;
        contactId: number;
        category: import('.prisma/client').$Enums.email_category_enum;
        value: string;
        isPrimary: boolean;
      }[];
      phone: {
        id: number;
        contactId: number;
        category: import('.prisma/client').$Enums.phone_category_enum;
        value: string;
        isPrimary: boolean;
      }[];
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
      address: string;
      id: number;
      name: string;
      description: string;
      isActive: boolean;
      location: string;
      code: string;
      managerName: string;
      managerPhone: string;
      managerEmail: string;
      computers: number;
      projectors: number;
      capacity: number;
      notes: string;
      createdAt: Date;
      updatedAt: Date;
    };
    submissions: ({
      assignment: {
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
    enrollments: ({
      course: {
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
          createdAt: Date;
          updatedAt: Date;
          employeeId: string;
          specialization: string;
        };
        assignments: {
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
        }[];
        skillCategory: {
          id: string;
          name: string;
          description: string;
        };
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
    } & {
      id: number;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      studentId: number;
      enrolledAt: Date;
      courseId: number;
      completedAt: Date;
      progress: number;
    })[];
    id: number;
    contactId: number;
    status: import('.prisma/client').$Enums.student_status_enum;
    hubId: number;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    enrolledAt: Date;
  }>;
  getStudentProgress(studentId: number): Promise<{
    student: {
      id: number;
      studentId: string;
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
    };
    courseProgress: {
      courseId: number;
      courseTitle: string;
      enrollmentStatus: import('.prisma/client').$Enums.enrollment_status_enum;
      progress: number;
      totalAssignments: number;
      completedAssignments: number;
    }[];
  }>;
  getStudentResources(studentId: number): Promise<{
    enrolledCourseResources: any[];
    publicResources: ({
      course: {
        hub: {
          address: string;
          id: number;
          name: string;
          description: string;
          isActive: boolean;
          location: string;
          code: string;
          managerName: string;
          managerPhone: string;
          managerEmail: string;
          computers: number;
          projectors: number;
          capacity: number;
          notes: string;
          createdAt: Date;
          updatedAt: Date;
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
    } & {
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
    })[];
  }>;
  findAllForClient(filters: {
    query?: string;
    hub?: string;
    hubId?: number;
    course?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    skip?: number;
  }): Promise<{
    data: {
      id: any;
      firstName: any;
      lastName: any;
      name: any;
      email: any;
      phone: any;
      hub: any;
      hubName: any;
      course: any;
      courseName: any;
      ageGroup: string;
      gender: any;
      civilStatus: string;
      avatar: any;
      status: any;
      registeredAt: any;
      occupation: string;
      residence: {};
    }[];
    total: number;
    todayCount: number;
    weekCount: number;
  }>;
  toClientModel(s: any): {
    id: any;
    firstName: any;
    lastName: any;
    name: any;
    email: any;
    phone: any;
    hub: any;
    hubName: any;
    course: any;
    courseName: any;
    ageGroup: string;
    gender: any;
    civilStatus: string;
    avatar: any;
    status: any;
    registeredAt: any;
    occupation: string;
    residence: {};
  };
  getPeople(_query?: string): Promise<
    {
      id: string;
      name: string;
      avatar: string;
      email: string;
      phone: string;
    }[]
  >;
  getPeopleCombo(skipUsers?: boolean): Promise<
    {
      id: string;
      name: string;
    }[]
  >;
  getEmails(studentId?: string): Promise<
    {
      id: any;
      studentId: string;
      value: any;
      category: any;
      isPrimary: any;
    }[]
  >;
  getPhones(studentId?: string): Promise<
    {
      id: any;
      studentId: string;
      value: any;
      category: any;
      isPrimary: any;
    }[]
  >;
  getStudentsByHub(): Promise<
    {
      hub: string;
      hubName: string;
      count: number;
    }[]
  >;
  update(
    id: number,
    dto: any,
  ): Promise<{
    id: number;
    contactId: number;
    status: import('.prisma/client').$Enums.student_status_enum;
    hubId: number;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    enrolledAt: Date;
  }>;
  getStudentSchedule(
    userId: number,
    from?: string,
    to?: string,
  ): Promise<
    | {
        events: any[];
        studentId?: undefined;
        studentRef?: undefined;
        courses?: undefined;
        assignments?: undefined;
      }
    | {
        studentId: number;
        studentRef: string;
        courses: {
          id: string;
          title: string;
          type: 'course';
          hub: string;
          hubCode: string;
          category: string;
          instructor: string;
          duration: string;
          progress: number;
          status: import('.prisma/client').$Enums.enrollment_status_enum;
          date: string;
        }[];
        assignments: {
          id: string;
          title: string;
          type: 'assignment';
          category: string;
          courseTitle: string;
          date: string;
          maxScore: number;
        }[];
        events?: undefined;
      }
  >;
  getMyCourses(userId: number): Promise<
    {
      enrollmentId: number;
      courseId: number;
      title: string;
      description: string;
      hub: string;
      hubCode: string;
      category: string;
      instructor: string;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      progress: number;
      enrolledAt: Date;
      completedAt: Date;
      moduleCount: number;
      assignmentCount: number;
    }[]
  >;
  getStudentEnrolledCourses(studentId: number): Promise<
    {
      enrollmentId: number;
      courseId: number;
      title: string;
      description: string;
      hub: string;
      category: string;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      progress: number;
      enrolledAt: Date;
      totalModules: number;
    }[]
  >;
  getMyCoursesByStudentId(studentId: number): Promise<
    {
      enrollmentId: number;
      courseId: number;
      title: string;
      description: string;
      hub: string;
      category: string;
      status: import('.prisma/client').$Enums.enrollment_status_enum;
      progress: number;
      enrolledAt: Date;
      totalModules: number;
    }[]
  >;
  createPerson(dto: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: string;
    gender: string;
    civilStatus?: string;
    ageGroup?: string;
    placeOfWork?: string;
    residence?: string;
    hub: string;
    course: string;
    email: string;
    phone?: string;
  }): Promise<{
    id: number;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    hub: string;
    course: string;
  }>;
  getRequests(
    userId?: number,
    type?: string,
  ): Promise<
    ({
      messages: {
        id: number;
        createdAt: Date;
        body: string;
        requestId: number;
        senderType: string;
        senderId: number;
      }[];
    } & {
      id: number;
      type: string;
      status: import('.prisma/client').$Enums.request_status_enum;
      createdAt: Date;
      updatedAt: Date;
      studentId: number;
      body: string;
      subject: string;
    })[]
  >;
  createRequest(
    userId: number,
    dto: {
      subject: string;
      body: string;
      type?: string;
    },
  ): Promise<{
    id: number;
    type: string;
    status: import('.prisma/client').$Enums.request_status_enum;
    createdAt: Date;
    updatedAt: Date;
    studentId: number;
    body: string;
    subject: string;
  }>;
  getRequestMessages(requestId: number): Promise<
    {
      id: number;
      createdAt: Date;
      body: string;
      requestId: number;
      senderType: string;
      senderId: number;
    }[]
  >;
  addRequestMessage(
    requestId: number,
    body: string,
    senderId?: number,
  ): Promise<{
    id: number;
    createdAt: Date;
    body: string;
    requestId: number;
    senderType: string;
    senderId: number;
  }>;
}
