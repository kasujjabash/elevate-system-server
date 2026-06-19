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
exports.AssignmentsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let AssignmentsService = class AssignmentsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(dto) {
    const assignment = await this.prisma.assignment.create({
      data: {
        courseId: dto.courseId,
        title: dto.title,
        description: dto.description || '',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        maxScore: dto.maxScore ?? 100,
        isMilestone: dto.isMilestone ?? false,
        isCoursePlayer: dto.isCoursePlayer ?? false,
        weekNumber: dto.weekNumber ?? null,
      },
      include: { course: true },
    });
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId: dto.courseId,
        status: { in: ['Enrolled', 'InProgress'] },
      },
      include: {
        student: { include: { contact: { include: { user: true } } } },
      },
    });
    const userIds = enrollments
      .map((e) => e.student?.contact?.user?.id)
      .filter((id) => !!id);
    if (userIds.length) {
      await this.prisma.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          title: 'New Assignment',
          message: `A new assignment "${dto.title}" has been posted${
            assignment.course ? ` in ${assignment.course.title}` : ''
          }.`,
          type: 'assignment',
          relatedId: assignment.id,
          relatedType: 'assignment',
        })),
      });
    }
    return assignment;
  }
  formatAssignment(a, enrolledMap) {
    const now = new Date();
    const isOverdue = a.dueDate && new Date(a.dueDate) < now;
    const submissionsCount = a.submissions?.length ?? 0;
    const gradedCount =
      a.submissions?.filter(
        (s) => s.status === 'Graded' || s.status === 'Returned',
      ).length ?? 0;
    const totalStudents = enrolledMap[a.courseId] ?? 0;
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      dueDate: a.dueDate,
      maxScore: a.maxScore,
      weekNumber: a.weekNumber ?? null,
      isMilestone: a.isMilestone ?? false,
      status: isOverdue ? 'closed' : 'open',
      course: a.course?.title ?? null,
      courseId: a.courseId,
      hub: a.course?.hub?.name ?? null,
      courseStartDate: null,
      submissionsCount,
      gradedCount,
      totalStudents,
      filesCount: 0,
      createdAt: a.createdAt,
    };
  }
  async findAll(options) {
    const where = {};
    if (options?.courseId) where.courseId = options.courseId;
    else if (options?.courseIds?.length)
      where.courseId = { in: options.courseIds };
    const assignments = await this.prisma.assignment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            hub: { select: { name: true } },
          },
        },
        submissions: { select: { id: true, status: true } },
      },
      orderBy: [{ courseId: 'asc' }, { dueDate: 'asc' }],
    });
    const courseIds = [...new Set(assignments.map((a) => a.courseId))];
    const enrollmentCounts = courseIds.length
      ? await this.prisma.enrollment.groupBy({
          by: ['courseId'],
          where: {
            courseId: { in: courseIds },
            status: { in: ['Enrolled', 'InProgress'] },
          },
          _count: { _all: true },
        })
      : [];
    const enrolledMap = {};
    enrollmentCounts.forEach((e) => {
      enrolledMap[e.courseId] = e._count._all;
    });
    return assignments.map((a) => this.formatAssignment(a, enrolledMap));
  }
  async findAllForTrainer(contactId, courseId) {
    let resolvedContactId = contactId;
    let instructor = await this.prisma.instructor.findFirst({
      where: { contactId: resolvedContactId },
      select: { id: true },
    });
    if (!instructor) {
      const user = await this.prisma.user.findFirst({
        where: { id: resolvedContactId },
        select: { contactId: true },
      });
      if (user?.contactId) {
        resolvedContactId = user.contactId;
        instructor = await this.prisma.instructor.findFirst({
          where: { contactId: resolvedContactId },
          select: { id: true },
        });
      }
    }
    if (!instructor) return [];
    const courses = await this.prisma.course.findMany({
      where: { instructorId: instructor.id },
      select: { id: true },
    });
    const courseIds = courses.map((c) => c.id);
    if (!courseIds.length) return [];
    const effectiveCourseIds =
      courseId && courseIds.includes(courseId) ? [courseId] : courseIds;
    return this.findAll({ courseIds: effectiveCourseIds });
  }
  async findByContact(contactId) {
    const student = await this.prisma.student.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!student) return [];
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: { notIn: ['Dropped'] },
      },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);
    if (courseIds.length === 0) return [];
    const assignments = await this.prisma.assignment.findMany({
      where: { courseId: { in: courseIds }, isActive: true },
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: [{ courseId: 'asc' }, { dueDate: 'asc' }],
    });
    const submissionMap = new Map();
    const submissions = await this.prisma.submission.findMany({
      where: {
        studentId: student.id,
        assignmentId: { in: assignments.map((a) => a.id) },
      },
    });
    submissions.forEach((s) => submissionMap.set(s.assignmentId, s));
    return assignments.map((a) => {
      const sub = submissionMap.get(a.id);
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        maxScore: a.maxScore,
        course: { id: a.course.id, name: a.course.title },
        submission: sub
          ? {
              id: sub.id,
              content: sub.content,
              link: sub.filePath?.startsWith('http') ? sub.filePath : undefined,
              filePath: sub.filePath,
              score: sub.score,
              feedback: sub.feedback,
              status: sub.status,
              submittedAt: sub.submittedAt,
            }
          : null,
      };
    });
  }
  async findByCourse(courseId) {
    return this.prisma.assignment.findMany({
      where: { courseId },
      include: {
        course: true,
        submissions: {
          include: {
            student: {
              include: { contact: { include: { person: true } } },
            },
          },
        },
      },
    });
  }
  async findOne(id) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: {
          include: {
            student: { include: { contact: { include: { person: true } } } },
          },
        },
      },
    });
  }
  async submitAssignment(assignmentId, contactId, body) {
    const student = await this.prisma.student.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!student)
      throw new common_1.NotFoundException('Student record not found');
    let assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) {
      const content = await this.prisma.module_content.findUnique({
        where: { id: assignmentId },
        include: { module: { select: { courseId: true } } },
      });
      if (!content)
        throw new common_1.NotFoundException('Assignment not found');
      const existing = await this.prisma.assignment.findFirst({
        where: {
          courseId: content.module.courseId,
          title: content.title,
          isCoursePlayer: true,
        },
      });
      assignment =
        existing ??
        (await this.prisma.assignment.create({
          data: {
            courseId: content.module.courseId,
            title: content.title,
            description: content.body || '',
            isCoursePlayer: true,
          },
        }));
    }
    if (
      !assignment.isCoursePlayer &&
      assignment.dueDate &&
      new Date() > new Date(assignment.dueDate)
    ) {
      throw new common_1.ForbiddenException('Submission deadline has passed');
    }
    const data = {
      assignmentId,
      studentId: student.id,
      status: 'Submitted',
      submittedAt: new Date(),
    };
    if (body.type === 'text') data.content = body.content;
    if (body.type === 'link') data.filePath = body.link;
    if (body.type === 'file') data.filePath = body.filePath ?? body.fileName;
    return this.prisma.submission.upsert({
      where: {
        studentId_assignmentId: { studentId: student.id, assignmentId },
      },
      create: data,
      update: { ...data, submittedAt: new Date() },
    });
  }
  async gradeSubmission(submissionId, dto) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new common_1.NotFoundException('Submission not found');
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: dto.score,
        feedback: dto.feedback,
        status: 'Graded',
        gradedAt: new Date(),
      },
      include: {
        student: { include: { contact: { include: { person: true } } } },
        assignment: true,
      },
    });
  }
  async likeSubmission(submissionId) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new common_1.NotFoundException('Submission not found');
    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'Graded', gradedAt: sub.gradedAt ?? new Date() },
    });
    return { liked: true, submissionId, status: updated.status };
  }
  async approveSubmission(submissionId) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: { select: { isCoursePlayer: true } } },
    });
    if (!sub) throw new common_1.NotFoundException('Submission not found');
    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'Approved', gradedAt: new Date() },
      include: {
        student: { include: { contact: { include: { person: true } } } },
        assignment: true,
      },
    });
    return updated;
  }
  async gradeByBody(dto) {
    return this.gradeSubmission(dto.submissionId, {
      score: dto.score,
      feedback: dto.feedback,
    });
  }
  async getAllSubmissions(filters) {
    const where = {};
    if (filters.status) {
      where.status =
        filters.status.charAt(0).toUpperCase() +
        filters.status.slice(1).toLowerCase();
    }
    if (filters.instructorContactId != null) {
      let resolvedContactId = filters.instructorContactId;
      let instructor = await this.prisma.instructor.findFirst({
        where: { contactId: resolvedContactId },
        select: { id: true },
      });
      if (!instructor) {
        const user = await this.prisma.user.findFirst({
          where: { id: resolvedContactId },
          select: { contactId: true },
        });
        if (user?.contactId) {
          resolvedContactId = user.contactId;
          instructor = await this.prisma.instructor.findFirst({
            where: { contactId: resolvedContactId },
            select: { id: true },
          });
        }
      }
      if (!instructor) return [];
      const courses = await this.prisma.course.findMany({
        where: { instructorId: instructor.id },
        select: { id: true },
      });
      const courseIds = courses.map((c) => c.id);
      if (!courseIds.length) return [];
      const effectiveCourseId =
        filters.courseId && courseIds.includes(parseInt(filters.courseId, 10))
          ? parseInt(filters.courseId, 10)
          : undefined;
      where.assignment = {
        courseId: effectiveCourseId ? effectiveCourseId : { in: courseIds },
      };
    } else if (filters.courseId) {
      where.assignment = { courseId: parseInt(filters.courseId, 10) };
    }
    return this.prisma.submission.findMany({
      where,
      include: {
        assignment: {
          include: { course: { select: { id: true, title: true } } },
        },
        student: { include: { contact: { include: { person: true } } } },
      },
      orderBy: { submittedAt: 'desc' },
      take: filters.limit ?? 50,
    });
  }
  async trainerOwnsAssignment(contactId, assignmentId) {
    let resolvedContactId = contactId;
    let instructor = await this.prisma.instructor.findFirst({
      where: { contactId: resolvedContactId },
      select: { id: true },
    });
    if (!instructor) {
      const user = await this.prisma.user.findFirst({
        where: { id: resolvedContactId },
        select: { contactId: true },
      });
      if (user?.contactId) {
        resolvedContactId = user.contactId;
        instructor = await this.prisma.instructor.findFirst({
          where: { contactId: resolvedContactId },
          select: { id: true },
        });
      }
    }
    if (!instructor) return false;
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { courseId: true },
    });
    if (!assignment) return false;
    const course = await this.prisma.course.findFirst({
      where: { id: assignment.courseId, instructorId: instructor.id },
      select: { id: true },
    });
    return !!course;
  }
  async getSubmissions(assignmentId) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: { include: { contact: { include: { person: true } } } },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  AssignmentsService,
);
//# sourceMappingURL=assignments.service.js.map
