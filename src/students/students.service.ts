import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: any) {
    // Generate unique student ID
    const studentCount = await this.prisma.student.count();
    const studentId = `EA${String(studentCount + 1).padStart(6, '0')}`;

    return this.prisma.student.create({
      data: {
        ...createStudentDto,
        studentId,
      },
      include: {
        contact: {
          include: {
            person: true,
            address: true,
            email: true,
            phone: true,
          },
        },
        hub: true,
      },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: {
        contact: {
          include: {
            person: true,
            email: true,
            phone: true,
          },
        },
        hub: true,
        enrollments: {
          include: {
            course: {
              include: {
                skillCategory: true,
              },
            },
          },
        },
      },
    });
  }

  async findByHub(hubId: number) {
    return this.prisma.student.findMany({
      where: { hubId },
      include: {
        contact: {
          include: {
            person: true,
          },
        },
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            person: true,
            address: true,
            email: true,
            phone: true,
          },
        },
        hub: true,
        enrollments: {
          include: {
            course: {
              include: {
                skillCategory: true,
                instructor: {
                  include: {
                    contact: {
                      include: {
                        person: true,
                      },
                    },
                  },
                },
                study_resources: {
                  where: {
                    OR: [
                      { isPublic: true },
                      // Student can access course resources they're enrolled in
                    ],
                  },
                },
                assignments: true,
              },
            },
          },
        },
        submissions: {
          include: {
            assignment: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
  }

  async getStudentProgress(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        contact: {
          include: {
            person: true,
          },
        },
        enrollments: {
          include: {
            course: {
              include: {
                assignments: {
                  include: {
                    submissions: {
                      where: { studentId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const progressData = student.enrollments.map((enrollment) => {
      const course = enrollment.course;
      const totalAssignments = course.assignments.length;
      const completedAssignments = course.assignments.filter(
        (assignment) => assignment.submissions.length > 0,
      ).length;

      const progressPercentage =
        totalAssignments > 0
          ? (completedAssignments / totalAssignments) * 100
          : 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        enrollmentStatus: enrollment.status,
        progress: progressPercentage,
        totalAssignments,
        completedAssignments,
      };
    });

    return {
      student: {
        id: student.id,
        studentId: student.studentId,
        contact: student.contact,
      },
      courseProgress: progressData,
    };
  }

  async getStudentResources(studentId: number) {
    const student = await this.findOne(studentId);

    if (!student) {
      throw new Error('Student not found');
    }

    // Get all resources from enrolled courses plus public resources
    const enrolledCourses = student.enrollments.map((e) => e.course);
    const allResources = [];

    for (const course of enrolledCourses) {
      allResources.push(...course.study_resources);
    }

    // Also get public resources from other courses
    const publicResources = await this.prisma.study_resource.findMany({
      where: { isPublic: true },
      include: {
        course: {
          include: {
            skillCategory: true,
            hub: true,
          },
        },
      },
    });

    return {
      enrolledCourseResources: allResources,
      publicResources,
    };
  }

  async findAllForClient(filters: {
    query?: string;
    hub?: string;
    course?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    skip?: number;
  }) {
    const where: any = {};
    if (filters.hub) where.hub = { code: filters.hub };
    if (filters.dateFrom || filters.dateTo) {
      where.enrolledAt = {};
      if (filters.dateFrom) where.enrolledAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.enrolledAt.lte = new Date(filters.dateTo);
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.limit || 50,
        include: {
          contact: { include: { person: true, email: true, phone: true } },
          hub: true,
          enrollments: {
            include: { course: { include: { skillCategory: true } } },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [todayCount, weekCount] = await Promise.all([
      this.prisma.student.count({ where: { enrolledAt: { gte: todayStart } } }),
      this.prisma.student.count({ where: { enrolledAt: { gte: weekAgo } } }),
    ]);

    const data = students.map((s) => this.toClientModel(s));
    return { data, total, todayCount, weekCount };
  }

  toClientModel(s: any) {
    const person = s.contact?.person;
    const email = s.contact?.email?.[0]?.value || '';
    const phone = s.contact?.phone?.[0]?.value || '';
    const primaryEnrollment = s.enrollments?.[0];
    return {
      id: s.id.toString(),
      firstName: person?.firstName || '',
      lastName: person?.lastName || '',
      name: person ? `${person.firstName} ${person.lastName}` : s.studentId,
      email,
      phone,
      hub: s.hub?.code || '',
      hubName: s.hub?.name || '',
      course: primaryEnrollment?.course?.skillCategory?.id || '',
      ageGroup: '',
      gender: person?.gender || '',
      civilStatus: '',
      avatar: person?.avatar || null,
      status: s.status.toLowerCase(),
      registeredAt: s.enrolledAt,
      occupation: '',
      residence: {},
    };
  }

  async getPeople(_query?: string) {
    const students = await this.prisma.student.findMany({
      take: 50,
      include: {
        contact: { include: { person: true, email: true, phone: true } },
      },
    });
    return students.map((s) => {
      const p = s.contact?.person;
      return {
        id: s.id.toString(),
        name: p ? `${p.firstName} ${p.lastName}` : s.studentId,
        avatar: p?.avatar || null,
        email: s.contact?.email?.[0]?.value || '',
        phone: s.contact?.phone?.[0]?.value || '',
      };
    });
  }

  async getPeopleCombo(skipUsers = false) {
    // For user creation: return all contacts with person records.
    // When skipUsers=true, exclude contacts that already have a user account.
    const existingUserContactIds = skipUsers
      ? (await this.prisma.user.findMany({ select: { contactId: true } }))
          .map((u) => u.contactId)
          .filter((id): id is number => id !== null)
      : [];

    const persons = await this.prisma.person.findMany({
      include: { contact: true },
      where: skipUsers ? { contactId: { notIn: existingUserContactIds } } : {},
    });

    return persons.map((p) => ({
      id: p.contactId.toString(),
      name: `${p.firstName} ${p.lastName}`.trim(),
    }));
  }

  async getEmails(studentId?: string) {
    if (!studentId) return [];
    const s = await this.prisma.student.findUnique({
      where: { id: parseInt(studentId, 10) },
      include: { contact: { include: { email: true } } },
    });
    return (s?.contact?.email || []).map((e: any) => ({
      id: e.id.toString(),
      studentId,
      value: e.value,
      category: e.category,
      isPrimary: e.isPrimary,
    }));
  }

  async getPhones(studentId?: string) {
    if (!studentId) return [];
    const s = await this.prisma.student.findUnique({
      where: { id: parseInt(studentId, 10) },
      include: { contact: { include: { phone: true } } },
    });
    return (s?.contact?.phone || []).map((p: any) => ({
      id: p.id.toString(),
      studentId,
      value: p.value,
      category: p.category,
      isPrimary: p.isPrimary,
    }));
  }

  async getStudentsByHub() {
    const hubs = await this.prisma.hub.findMany({
      include: { _count: { select: { students: true } } },
    });
    return hubs.map((h) => ({
      hub: h.code,
      hubName: h.name,
      count: h._count.students,
    }));
  }

  async update(id: number, dto: any) {
    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  async getStudentSchedule(userId: number, from?: string, to?: string) {
    // Find the student record linked to this user account
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { contact: true },
    });

    if (!user?.contactId) return { events: [] };

    const student = await this.prisma.student.findFirst({
      where: { contactId: user.contactId },
      include: {
        enrollments: {
          where: { status: 'Enrolled' },
          include: {
            course: {
              include: {
                hub: true,
                skillCategory: true,
                instructor: {
                  include: { contact: { include: { person: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!student) return { events: [] };

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Enrolled courses
    const courseEvents = student.enrollments.map((enrollment) => {
      const course = enrollment.course;
      const instructor = course.instructor?.contact?.person;
      return {
        id: `enrollment-${enrollment.id}`,
        title: course.title,
        type: 'course' as const,
        hub: course.hub?.name || '',
        hubCode: course.hub?.code || '',
        category: course.skillCategory?.name || '',
        instructor: instructor
          ? `${instructor.firstName} ${instructor.lastName}`
          : null,
        duration: course.duration || '',
        progress: enrollment.progress ?? 0,
        status: enrollment.status,
        date: null as string | null,
      };
    });

    // Assignment due dates for the student's enrolled courses
    const enrolledCourseIds = student.enrollments.map((e) => e.courseId);
    const assignments = await this.prisma.assignment.findMany({
      where: {
        courseId: { in: enrolledCourseIds },
        isActive: true,
        dueDate: {
          ...(fromDate ? { gte: fromDate } : {}),
          ...(toDate ? { lte: toDate } : {}),
        },
      },
      include: { course: { include: { skillCategory: true } } },
      orderBy: { dueDate: 'asc' },
    });

    const assignmentEvents = assignments
      .filter((a) => a.dueDate != null)
      .map((a) => ({
        id: `assignment-${a.id}`,
        title: a.title,
        type: 'assignment' as const,
        category: a.course.skillCategory?.name || '',
        courseTitle: a.course.title,
        date: a.dueDate!.toISOString(),
        maxScore: a.maxScore,
      }));

    return {
      studentId: student.id,
      studentRef: student.studentId,
      courses: courseEvents,
      assignments: assignmentEvents,
    };
  }

  // GET /api/students/me/courses — enrolled courses with progress + module count
  async getMyCourses(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { contact: true },
    });
    if (!user?.contactId) return [];

    const student = await this.prisma.student.findFirst({
      where: { contactId: user.contactId },
    });
    if (!student) return [];

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: { notIn: ['Dropped'] },
      },
      include: {
        course: {
          include: {
            hub: true,
            skillCategory: true,
            instructor: { include: { contact: { include: { person: true } } } },
            _count: { select: { modules: true, assignments: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return enrollments.map((e) => {
      const c = e.course;
      const instr = c.instructor?.contact?.person;
      return {
        enrollmentId: e.id,
        courseId: c.id,
        title: c.title,
        description: c.description,
        hub: c.hub?.name || '',
        hubCode: c.hub?.code || '',
        category: c.skillCategory?.name || '',
        instructor: instr ? `${instr.firstName} ${instr.lastName}` : null,
        status: e.status,
        progress: e.progress,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        moduleCount: c._count.modules,
        assignmentCount: c._count.assignments,
      };
    });
  }

  async getStudentEnrolledCourses(studentId: number) {
    return this.getMyCoursesByStudentId(studentId);
  }

  async getMyCoursesByStudentId(studentId: number) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        status: { notIn: ['Dropped'] },
      },
      include: {
        course: {
          include: {
            hub: true,
            skillCategory: true,
            _count: { select: { modules: true, assignments: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    return enrollments.map((e) => ({
      enrollmentId: e.id,
      courseId: e.courseId,
      title: e.course.title,
      description: e.course.description,
      hub: e.course.hub?.name || '',
      category: e.course.skillCategory?.name || '',
      status: e.status,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      totalModules: e.course._count.modules,
    }));
  }

  async createPerson(dto: {
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
  }) {
    // Resolve hub by name
    const hub = await this.prisma.hub.findFirst({
      where: { name: { contains: dto.hub, mode: 'insensitive' } },
    });
    if (!hub) throw new Error(`Hub "${dto.hub}" not found`);

    // Resolve course by title
    const course = await this.prisma.course.findFirst({
      where: {
        title: { contains: dto.course, mode: 'insensitive' },
        isActive: true,
      },
    });
    if (!course) throw new Error(`Course "${dto.course}" not found`);

    // Generate student ID
    const count = await this.prisma.student.count();
    const studentId = `EA${String(count + 1).padStart(6, '0')}`;

    // Create contact → person → email → phone → student → enrollment in one transaction
    const contact = await this.prisma.contact.create({
      data: { category: 'Person' },
    });

    await this.prisma.person.create({
      data: {
        contactId: contact.id,
        firstName: dto.firstName,
        middleName: dto.middleName || null,
        lastName: dto.lastName,
        gender: dto.gender as any,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
      },
    });

    if (dto.email) {
      await this.prisma.email.create({
        data: {
          contactId: contact.id,
          value: dto.email,
          isPrimary: true,
          category: 'Personal' as any,
        },
      });
    }

    if (dto.phone) {
      await this.prisma.phone.create({
        data: {
          contactId: contact.id,
          value: dto.phone,
          isPrimary: true,
          category: 'Mobile' as any,
        },
      });
    }

    const student = await this.prisma.student.create({
      data: {
        studentId,
        contactId: contact.id,
        hubId: hub.id,
        status: 'Active',
      },
    });

    await this.prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        status: 'Enrolled',
      },
    });

    return {
      id: student.id,
      studentId: student.studentId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      hub: hub.name,
      course: course.title,
    };
  }

  async getRequests(userId?: number, type?: string) {
    if (!userId) return [];
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { contact: true },
    });
    if (!user?.contactId) return [];
    const student = await this.prisma.student.findFirst({
      where: { contactId: user.contactId },
    });
    if (!student) return [];
    return this.prisma.student_request.findMany({
      where: { studentId: student.id, ...(type ? { type } : {}) },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRequest(
    userId: number,
    dto: { subject: string; body: string; type?: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { contact: true },
    });
    if (!user?.contactId) throw new Error('Student not found');
    const student = await this.prisma.student.findFirst({
      where: { contactId: user.contactId },
    });
    if (!student) throw new Error('Student not found');
    return this.prisma.student_request.create({
      data: {
        studentId: student.id,
        subject: dto.subject,
        body: dto.body,
        type: dto.type || 'inquiry',
      },
    });
  }

  async getRequestMessages(requestId: number) {
    return this.prisma.request_message.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addRequestMessage(requestId: number, body: string, senderId?: number) {
    return this.prisma.request_message.create({
      data: {
        requestId,
        body,
        senderType: 'student',
        senderId: senderId || null,
      },
    });
  }
}
