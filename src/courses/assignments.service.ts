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
      },
      include: { course: true },
    });
  }

  // ── Admin/Trainer: list all assignments (optionally filtered by course) ──
  async findAll(courseId?: number) {
    return this.prisma.assignment.findMany({
      where: courseId ? { courseId } : undefined,
      include: {
        course: { select: { id: true, title: true } },
        submissions: {
          include: {
            student: {
              include: { contact: { include: { person: true } } },
            },
          },
        },
      },
      orderBy: [{ courseId: 'asc' }, { dueDate: 'asc' }],
    });
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
