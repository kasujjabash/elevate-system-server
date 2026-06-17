'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.StudentsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let StudentsService = class StudentsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(createStudentDto) {
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
  async findByHub(hubId) {
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
  async findOne(id) {
    const student = await this.prisma.student.findUnique({
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
                    OR: [{ isPublic: true }],
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
    if (!student) return null;
    const user = await this.prisma.user.findFirst({
      where: { contactId: student.contactId },
      select: { id: true },
    });
    return { ...student, userId: user?.id ?? null };
  }
  async getStudentProgress(studentId) {
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
  async getStudentResources(studentId) {
    const student = await this.findOne(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    const enrolledCourses = student.enrollments.map((e) => e.course);
    const allResources = [];
    for (const course of enrolledCourses) {
      allResources.push(...course.study_resources);
    }
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
  async findAllForClient(filters) {
    const where = {};
    if (filters.hubId) where.hubId = filters.hubId;
    else if (filters.hub) where.hub = { code: filters.hub };
    if (filters.dateFrom || filters.dateTo) {
      where.enrolledAt = {};
      if (filters.dateFrom) where.enrolledAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.enrolledAt.lte = new Date(filters.dateTo);
    }
    if (filters.query) {
      const q = filters.query.trim();
      where.contact = {
        OR: [
          { person: { firstName: { contains: q, mode: 'insensitive' } } },
          { person: { lastName: { contains: q, mode: 'insensitive' } } },
          { email: { some: { value: { contains: q, mode: 'insensitive' } } } },
        ],
      };
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
  toClientModel(s) {
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
      courseName: primaryEnrollment?.course?.title || '',
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
  async getPeople(_query) {
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
    const existingUserContactIds = skipUsers
      ? (await this.prisma.user.findMany({ select: { contactId: true } }))
          .map((u) => u.contactId)
          .filter((id) => id !== null)
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
  async getEmails(studentId) {
    if (!studentId) return [];
    const s = await this.prisma.student.findUnique({
      where: { id: parseInt(studentId, 10) },
      include: { contact: { include: { email: true } } },
    });
    return (s?.contact?.email || []).map((e) => ({
      id: e.id.toString(),
      studentId,
      value: e.value,
      category: e.category,
      isPrimary: e.isPrimary,
    }));
  }
  async getPhones(studentId) {
    if (!studentId) return [];
    const s = await this.prisma.student.findUnique({
      where: { id: parseInt(studentId, 10) },
      include: { contact: { include: { phone: true } } },
    });
    return (s?.contact?.phone || []).map((p) => ({
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
  async update(id, dto) {
    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }
  async getStudentSchedule(userId, from, to) {
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
    const courseEvents = student.enrollments.map((enrollment) => {
      const course = enrollment.course;
      const instructor = course.instructor?.contact?.person;
      return {
        id: `enrollment-${enrollment.id}`,
        title: course.title,
        type: 'course',
        hub: course.hub?.name || '',
        hubCode: course.hub?.code || '',
        category: course.skillCategory?.name || '',
        instructor: instructor
          ? `${instructor.firstName} ${instructor.lastName}`
          : null,
        duration: course.duration || '',
        progress: enrollment.progress ?? 0,
        status: enrollment.status,
        date: null,
      };
    });
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
        type: 'assignment',
        category: a.course.skillCategory?.name || '',
        courseTitle: a.course.title,
        date: a.dueDate.toISOString(),
        maxScore: a.maxScore,
      }));
    return {
      studentId: student.id,
      studentRef: student.studentId,
      courses: courseEvents,
      assignments: assignmentEvents,
    };
  }
  async getMyCourses(userId) {
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
  async getStudentEnrolledCourses(studentId) {
    return this.getMyCoursesByStudentId(studentId);
  }
  async getMyCoursesByStudentId(studentId) {
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
  async createPerson(dto) {
    const hub = await this.prisma.hub.findFirst({
      where: { name: { contains: dto.hub, mode: 'insensitive' } },
    });
    if (!hub) throw new Error(`Hub "${dto.hub}" not found`);
    const course = await this.prisma.course.findFirst({
      where: {
        title: { contains: dto.course, mode: 'insensitive' },
        isActive: true,
      },
    });
    if (!course) throw new Error(`Course "${dto.course}" not found`);
    const count = await this.prisma.student.count();
    const studentId = `EA${String(count + 1).padStart(6, '0')}`;
    const contact = await this.prisma.contact.create({
      data: { category: 'Person' },
    });
    await this.prisma.person.create({
      data: {
        contactId: contact.id,
        firstName: dto.firstName,
        middleName: dto.middleName || null,
        lastName: dto.lastName,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
      },
    });
    if (dto.email) {
      await this.prisma.email.create({
        data: {
          contactId: contact.id,
          value: dto.email,
          isPrimary: true,
          category: 'Personal',
        },
      });
    }
    if (dto.phone) {
      await this.prisma.phone.create({
        data: {
          contactId: contact.id,
          value: dto.phone,
          isPrimary: true,
          category: 'Mobile',
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
  async getRequests(userId, type) {
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
  async createRequest(userId, dto) {
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
  async getRequestMessages(requestId) {
    return this.prisma.request_message.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
    });
  }
  async addRequestMessage(requestId, body, senderId) {
    return this.prisma.request_message.create({
      data: {
        requestId,
        body,
        senderType: 'student',
        senderId: senderId || null,
      },
    });
  }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  StudentsService,
);
//# sourceMappingURL=students.service.js.map
