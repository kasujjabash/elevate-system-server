import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  // ── Admin: create an assignment ──────────────────────────────────────────
  async create(dto: {
    courseId: number;
    title: string;
    description?: string;
    dueDate?: string;
    maxScore?: number;
    isMilestone?: boolean;
    weekNumber?: number;
  }) {
    return this.prisma.assignment.create({
      data: {
        courseId: dto.courseId,
        title: dto.title,
        description: dto.description || '',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        maxScore: dto.maxScore ?? 100,
        isMilestone: dto.isMilestone ?? false,
        weekNumber: dto.weekNumber ?? null,
      },
      include: { course: true },
    });
  }

  // ── Format a raw assignment row into the shape the client expects ──────────
  private formatAssignment(a: any, enrolledMap: Record<number, number>): any {
    const now = new Date();
    const isOverdue = a.dueDate && new Date(a.dueDate) < now;
    const submissionsCount = a.submissions?.length ?? 0;
    const gradedCount =
      a.submissions?.filter(
        (s: any) => s.status === 'Graded' || s.status === 'Returned',
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

  // ── Admin/Trainer: list all assignments (optionally filtered by course) ──
  async findAll(options?: { courseId?: number; courseIds?: number[] }) {
    const where: any = {};
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

    // Build enrolled-count map per courseId
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
    const enrolledMap: Record<number, number> = {};
    enrollmentCounts.forEach((e) => {
      enrolledMap[e.courseId] = e._count._all;
    });

    return assignments.map((a) => this.formatAssignment(a, enrolledMap));
  }

  // ── Trainer: assignments only for courses they teach ─────────────────────
  async findAllForTrainer(contactId: number, courseId?: number) {
    let resolvedContactId = contactId;

    // Fallback: if no instructor found by contactId, try resolving via user.id
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

  // ── Student: list ALL assignments for their enrolled courses ──────────────
  async findByContact(contactId: number) {
    const student = await this.prisma.student.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!student) return [];

    // Get all active course enrollments
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: { notIn: ['Dropped'] },
      },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);
    if (courseIds.length === 0) return [];

    // Fetch all assignments for those courses
    const assignments = await this.prisma.assignment.findMany({
      where: { courseId: { in: courseIds }, isActive: true },
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: [{ courseId: 'asc' }, { dueDate: 'asc' }],
    });

    // Fetch student's submissions for those assignments
    const submissionMap = new Map<number, any>();
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

  async findByCourse(courseId: number) {
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

  async findOne(id: number) {
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

  // ── Student: submit an assignment ────────────────────────────────────────
  // Accepts contactId (from JWT) and resolves to studentId internally.
  async submitAssignment(
    assignmentId: number,
    contactId: number,
    body: { type?: string; content?: string; link?: string; fileName?: string },
  ) {
    const student = await this.prisma.student.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!student) throw new NotFoundException('Student record not found');

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');

    // Store link in filePath; text/answer in content
    const data: any = {
      assignmentId,
      studentId: student.id,
      status: 'Submitted',
      submittedAt: new Date(),
    };
    if (body.type === 'text') data.content = body.content;
    if (body.type === 'link') data.filePath = body.link;
    if (body.type === 'file') data.filePath = body.fileName; // real path set by file upload

    // Upsert: allow re-submission
    return this.prisma.submission.upsert({
      where: {
        studentId_assignmentId: { studentId: student.id, assignmentId },
      },
      create: data,
      update: { ...data, submittedAt: new Date() },
    });
  }

  // ── Admin/Trainer: grade a submission ───────────────────────────────────
  async gradeSubmission(
    submissionId: number,
    dto: { score: number; feedback?: string },
  ) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new NotFoundException('Submission not found');

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

  // ── Admin: list all submissions across all assignments (for dashboard) ───
  async getAllSubmissions(filters: {
    status?: string;
    limit?: number;
    courseId?: string;
  }) {
    const where: any = {};
    if (filters.status) {
      // Normalize to PascalCase to match submission_status_enum (Submitted, Graded, Returned)
      where.status =
        filters.status.charAt(0).toUpperCase() +
        filters.status.slice(1).toLowerCase();
    }
    if (filters.courseId) {
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

  // ── Admin: list all submissions for an assignment ───────────────────────
  async getSubmissions(assignmentId: number) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: { include: { contact: { include: { person: true } } } },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
