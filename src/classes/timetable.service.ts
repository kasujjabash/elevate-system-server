import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

export interface TimetableSessionDto {
  courseId: number;
  hubId?: number | null;
  instructorName?: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  meetLink?: string | null;
}

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  // ── helpers ────────────────────────────────────────────────────────────────

  private isLiveNow(
    dayOfWeek: number,
    startTime: string,
    endTime: string,
  ): boolean {
    const now = new Date();
    if (now.getDay() !== dayOfWeek) return false;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= sh * 60 + sm && cur <= eh * 60 + em;
  }

  private toResponse(s: any) {
    const isToday = s.dayOfWeek === new Date().getDay();
    return {
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      room: s.room ?? null,
      meetLink: s.meetLink ?? null,
      courseId: s.courseId,
      courseName: s.course?.title ?? null,
      moduleCode: s.course?.skillCategory?.id ?? null,
      hubId: s.hubId ?? null,
      hubName: s.hub?.name ?? null,
      instructorName: s.instructorName ?? null,
      isToday,
      isLive: isToday && this.isLiveNow(s.dayOfWeek, s.startTime, s.endTime),
    };
  }

  private get include() {
    return {
      course: { include: { skillCategory: true } },
      hub: { select: { id: true, name: true } },
    };
  }

  // ── queries ────────────────────────────────────────────────────────────────

  async findAll(filters: { hubId?: string; courseId?: string }) {
    const where: any = {};
    if (filters.hubId) where.hubId = parseInt(filters.hubId, 10);
    if (filters.courseId) where.courseId = parseInt(filters.courseId, 10);

    const sessions = await this.prisma.timetable_session.findMany({
      where,
      include: this.include,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return sessions.map((s) => this.toResponse(s));
  }

  async findForStudent(studentIdOrUserId: string) {
    const parsed = parseInt(studentIdOrUserId, 10);
    if (isNaN(parsed)) return [];

    // Resolve real contactId — the value may be a userId when user.contactId is null in JWT
    let resolvedContactId: number = parsed;
    let student = await this.prisma.student.findFirst({
      where: { contactId: parsed },
      select: { id: true },
    });

    if (!student) {
      const user = await this.prisma.user.findFirst({
        where: { id: parsed },
        select: { contactId: true },
      });
      if (user?.contactId) {
        resolvedContactId = user.contactId;
        student = await this.prisma.student.findFirst({
          where: { contactId: user.contactId },
          select: { id: true },
        });
      }
    }

    // ── Student path: return sessions for enrolled courses ─────────────────
    if (student) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: {
          studentId: student.id,
          status: { in: ['Enrolled', 'InProgress'] },
        },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);
      if (courseIds.length) {
        const sessions = await this.prisma.timetable_session.findMany({
          where: { courseId: { in: courseIds } },
          include: this.include,
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
        return sessions.map((s) => this.toResponse(s));
      }
    }

    // ── Instructor/Trainer path: return sessions for assigned courses ───────
    const instructor = await this.prisma.instructor.findFirst({
      where: { contactId: resolvedContactId },
      select: { id: true },
    });
    if (instructor) {
      const courses = await this.prisma.course.findMany({
        where: { instructorId: instructor.id },
        select: { id: true },
      });
      const courseIds = courses.map((c) => c.id);
      if (courseIds.length) {
        const sessions = await this.prisma.timetable_session.findMany({
          where: { courseId: { in: courseIds } },
          include: this.include,
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
        return sessions.map((s) => this.toResponse(s));
      }
    }

    return [];
  }

  async create(dto: TimetableSessionDto) {
    const session = await this.prisma.timetable_session.create({
      data: {
        courseId: dto.courseId,
        hubId: dto.hubId ?? null,
        instructorName: dto.instructorName ?? null,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        room: dto.room ?? null,
        meetLink: dto.meetLink ?? null,
      },
      include: this.include,
    });
    return this.toResponse(session);
  }

  async update(id: number, dto: Partial<TimetableSessionDto>) {
    const existing = await this.prisma.timetable_session.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Timetable session not found');

    const session = await this.prisma.timetable_session.update({
      where: { id },
      data: {
        ...(dto.courseId !== undefined && { courseId: dto.courseId }),
        ...(dto.hubId !== undefined && { hubId: dto.hubId }),
        ...(dto.instructorName !== undefined && {
          instructorName: dto.instructorName,
        }),
        ...(dto.dayOfWeek !== undefined && { dayOfWeek: dto.dayOfWeek }),
        ...(dto.startTime !== undefined && { startTime: dto.startTime }),
        ...(dto.endTime !== undefined && { endTime: dto.endTime }),
        ...(dto.room !== undefined && { room: dto.room }),
        ...(dto.meetLink !== undefined && { meetLink: dto.meetLink }),
      },
      include: this.include,
    });
    return this.toResponse(session);
  }

  async remove(id: number) {
    const existing = await this.prisma.timetable_session.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Timetable session not found');
    await this.prisma.timetable_session.delete({ where: { id } });
    return { success: true };
  }

  /** Count of sessions scheduled for today — used by dashboard */
  async countToday(): Promise<number> {
    return this.prisma.timetable_session.count({
      where: { dayOfWeek: new Date().getDay() },
    });
  }
}
