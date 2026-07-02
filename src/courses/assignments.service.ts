import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
    isCoursePlayer?: boolean;
    weekNumber?: number;
    hubId?: number;
  }) {
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
        hubId: dto.hubId ?? null,
      },
      include: { course: true },
    });

    // Hub-scoped assignments only notify students in that hub
    const targetHubId = dto.hubId ?? null;

    // Notify all students enrolled in this course (scoped to the hub, if set)
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        courseId: dto.courseId,
        status: { in: ['Enrolled', 'InProgress'] },
        ...(targetHubId ? { student: { hubId: targetHubId } } : {}),
      },
      include: {
        student: { include: { contact: { include: { user: true } } } },
      },
    });
    const userIds = enrollments
      .map((e) => e.student?.contact?.user?.id)
      .filter((id): id is number => !!id);
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
      hubId: a.hubId ?? null,
      hubName: a.hub?.name ?? null,
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
        hub: { select: { id: true, name: true } },
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
      select: { id: true, hubId: true },
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

    // Fetch all assignments for those courses, excluding ones scoped to a
    // different hub than the student's own
    const assignments = await this.prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
        isActive: true,
        OR: [{ hubId: null }, { hubId: student.hubId }],
      },
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
    body: {
      type?: string;
      content?: string;
      link?: string;
      fileName?: string;
      filePath?: string;
    },
  ) {
    const student = await this.prisma.student.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!student) throw new NotFoundException('Student record not found');

    let assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      // Course player submits with module_content.id — resolve it to a real assignment
      const content = await this.prisma.module_content.findUnique({
        where: { id: assignmentId },
        include: { module: { select: { courseId: true } } },
      });
      if (!content) throw new NotFoundException('Assignment not found');

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

    // Course-player assignments are always open; regular assignments enforce the due date
    if (
      !assignment.isCoursePlayer &&
      assignment.dueDate &&
      new Date() > new Date(assignment.dueDate)
    ) {
      throw new ForbiddenException('Submission deadline has passed');
    }

    // Once graded, the submission is locked — no further edits/resubmission,
    // even if the due date hasn't passed.
    const existing = await this.prisma.submission.findUnique({
      where: {
        studentId_assignmentId: { studentId: student.id, assignmentId },
      },
      select: { score: true },
    });
    if (existing?.score != null) {
      throw new ForbiddenException(
        'This assignment has already been graded and cannot be edited',
      );
    }

    // Store link in filePath; text/answer in content
    const data: any = {
      assignmentId,
      studentId: student.id,
      status: 'Submitted',
      submittedAt: new Date(),
    };
    if (body.type === 'text') data.content = body.content;
    if (body.type === 'link') data.filePath = body.link;
    if (body.type === 'file') data.filePath = body.filePath ?? body.fileName;

    // Upsert: allow re-submission (only reachable above the grade/due-date
    // checks, so any existing row here is guaranteed ungraded).
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

  // ── Trainer: like/acknowledge a submission ───────────────────────────────
  async likeSubmission(submissionId: number) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });
    if (!sub) throw new NotFoundException('Submission not found');
    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'Graded', gradedAt: sub.gradedAt ?? new Date() },
    });
    return { liked: true, submissionId, status: updated.status };
  }

  // ── Trainer: approve a course-player submission ──────────────────────────
  async approveSubmission(submissionId: number) {
    const sub = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: { select: { isCoursePlayer: true } } },
    });
    if (!sub) throw new NotFoundException('Submission not found');

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

  // ── Admin/Trainer: grade via POST body ───────────────────────────────────
  async gradeByBody(dto: {
    submissionId: number;
    score: number;
    feedback?: string;
  }) {
    return this.gradeSubmission(dto.submissionId, {
      score: dto.score,
      feedback: dto.feedback,
    });
  }

  // ── Admin/Trainer: list submissions (always scoped to trainer's courses) ──
  async getAllSubmissions(filters: {
    status?: string;
    limit?: number;
    courseId?: string;
    instructorContactId?: number;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status =
        filters.status.charAt(0).toUpperCase() +
        filters.status.slice(1).toLowerCase();
    }

    // Scope to a specific instructor's courses
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
        student: {
          include: {
            contact: { include: { person: true } },
            hub: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: filters.limit ?? 50,
    });
  }

  // ── Check whether a trainer (by contactId) owns the course an assignment belongs to ──
  async trainerOwnsAssignment(
    contactId: number,
    assignmentId: number,
  ): Promise<boolean> {
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

  // ── Trainer/Admin: update an assignment ────────────────────────────────
  async update(
    id: number,
    dto: {
      title?: string;
      description?: string;
      dueDate?: string | null;
      maxScore?: number;
      weekNumber?: number | null;
      hubId?: number | null;
    },
    trainerContactId: number,
    isAdmin: boolean,
  ) {
    if (!isAdmin) {
      const owns = await this.trainerOwnsAssignment(trainerContactId, id);
      if (!owns)
        throw new ForbiddenException(
          'You do not have permission to edit this assignment',
        );
    }

    return this.prisma.assignment.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.maxScore !== undefined && { maxScore: Number(dto.maxScore) }),
        ...(dto.weekNumber !== undefined && {
          weekNumber: dto.weekNumber !== null ? Number(dto.weekNumber) : null,
        }),
        ...(dto.hubId !== undefined && {
          hubId: dto.hubId !== null ? Number(dto.hubId) : null,
        }),
      },
      include: { course: true },
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
