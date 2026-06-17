import { StudentsService } from './students.service';
import { EnrollmentService } from './enrollment.service';
export declare class StudentsController {
  private readonly studentsService;
  private readonly enrollmentService;
  constructor(
    studentsService: StudentsService,
    enrollmentService: EnrollmentService,
  );
  findAll(
    req: any,
    query?: string,
    hub?: string,
    hubId?: string,
    course?: string,
    dateFrom?: string,
    dateTo?: string,
    limit?: string,
    skip?: string,
  ): Promise<{
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
  getMyCourses(req: any): Promise<
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
  getMySchedule(
    req: any,
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
  createPerson(body: any): Promise<{
    id: number;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    hub: string;
    course: string;
  }>;
  getPeople(query?: string): Promise<
    {
      id: string;
      name: string;
      avatar: string;
      email: string;
      phone: string;
    }[]
  >;
  getPeopleCombo(skipUsers?: string): Promise<
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
  getAddresses(_studentId?: string): any[];
  getIdentifications(_studentId?: string): any[];
  getRequests(
    type?: string,
    req?: any,
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
    body: any,
    req?: any,
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
  getRequestMessages(id: number): Promise<
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
    id: number,
    body: any,
    req?: any,
  ): Promise<{
    id: number;
    createdAt: Date;
    body: string;
    requestId: number;
    senderType: string;
    senderId: number;
  }>;
  updateAvatar(
    _file: any,
    _studentId: string,
  ): {
    avatarUrl: any;
  };
  importStudents(_file: any): {
    imported: number;
    failed: number;
    errors: any[];
  };
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
        createdAt: Date;
        updatedAt: Date;
        courseId: number;
        weekNumber: number;
        dueDate: Date;
        maxScore: number;
        isMilestone: boolean;
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
          employeeId: string;
          specialization: string;
          createdAt: Date;
          updatedAt: Date;
        };
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
  update(
    id: number,
    body: any,
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
  getProgress(id: number): Promise<{
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
  getResources(id: number): Promise<{
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
  enrollInCourse(
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
}
