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
exports.TimetableService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let TimetableService = class TimetableService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  isLiveNow(dayOfWeek, startTime, endTime) {
    const now = new Date();
    if (now.getDay() !== dayOfWeek) return false;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const cur = now.getHours() * 60 + now.getMinutes();
    return cur >= sh * 60 + sm && cur <= eh * 60 + em;
  }
  toResponse(s) {
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
  get include() {
    return {
      course: { include: { skillCategory: true } },
      hub: { select: { id: true, name: true } },
    };
  }
  async findAll(filters) {
    const where = {};
    if (filters.hubId) where.hubId = parseInt(filters.hubId, 10);
    if (filters.courseId) where.courseId = parseInt(filters.courseId, 10);
    const sessions = await this.prisma.timetable_session.findMany({
      where,
      include: this.include,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
    return sessions.map((s) => this.toResponse(s));
  }
  async findAllScoped(filters, jwtUser) {
    if (!jwtUser) return this.findAll(filters);
    const roles = Array.isArray(jwtUser.roles)
      ? jwtUser.roles
      : (jwtUser.roles ?? '')
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
    const isAdmin = roles.some((r) => ['ADMIN', 'SUPER_ADMIN'].includes(r));
    const isHubManager = roles.includes('HUB_MANAGER');
    const isTrainer = roles.includes('TRAINER');
    const isStudent = roles.includes('STUDENT');
    if (isAdmin) return this.findAll(filters);
    if (isHubManager) {
      const hubId = String(jwtUser.hubId ?? filters.hubId ?? '');
      return this.findAll({ ...filters, hubId: hubId || undefined });
    }
    if (isTrainer) {
      const contactId = Number(jwtUser.contactId ?? jwtUser.id);
      const instructor = await this.prisma.instructor.findFirst({
        where: { contactId },
        select: { id: true },
      });
      if (!instructor) return [];
      const courses = await this.prisma.course.findMany({
        where: { instructorId: instructor.id },
        select: { id: true },
      });
      const courseIds = courses.map((c) => c.id);
      if (!courseIds.length) return [];
      const where = { courseId: { in: courseIds } };
      if (filters.courseId) where.courseId = parseInt(filters.courseId, 10);
      const sessions = await this.prisma.timetable_session.findMany({
        where,
        include: this.include,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      });
      return sessions.map((s) => this.toResponse(s));
    }
    if (isStudent) {
      const contactId = Number(jwtUser.contactId ?? jwtUser.id);
      const student = await this.prisma.student.findFirst({
        where: { contactId },
        select: { id: true, hubId: true },
      });
      if (!student) return [];
      const enrollments = await this.prisma.enrollment.findMany({
        where: {
          studentId: student.id,
          status: { in: ['Enrolled', 'InProgress'] },
        },
        select: { courseId: true },
      });
      const courseIds = enrollments.map((e) => e.courseId);
      if (!courseIds.length) return [];
      const where = {
        courseId: { in: courseIds },
        OR: [{ hubId: student.hubId }, { hubId: null }],
      };
      if (filters.courseId) where.courseId = parseInt(filters.courseId, 10);
      const sessions = await this.prisma.timetable_session.findMany({
        where,
        include: this.include,
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      });
      return sessions.map((s) => this.toResponse(s));
    }
    return this.findAll(filters);
  }
  async findForJwtUser(jwtUser) {
    if (!jwtUser) return [];
    const key = String(jwtUser.contactId ?? jwtUser.id ?? '');
    return this.findForStudent(key);
  }
  async findForStudent(studentIdOrUserId) {
    const parsed = parseInt(studentIdOrUserId, 10);
    if (isNaN(parsed)) return [];
    let resolvedContactId = parsed;
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
  async create(dto) {
    const courseId = parseInt(String(dto.courseId), 10);
    if (isNaN(courseId))
      throw new common_1.NotFoundException('Invalid courseId');
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course)
      throw new common_1.NotFoundException(
        `Course ${courseId} not found — timetable not saved`,
      );
    const session = await this.prisma.timetable_session.create({
      data: {
        courseId,
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
  async update(id, dto) {
    const existing = await this.prisma.timetable_session.findUnique({
      where: { id },
    });
    if (!existing)
      throw new common_1.NotFoundException('Timetable session not found');
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
  async remove(id) {
    const existing = await this.prisma.timetable_session.findUnique({
      where: { id },
    });
    if (!existing)
      throw new common_1.NotFoundException('Timetable session not found');
    await this.prisma.timetable_session.delete({ where: { id } });
    return { success: true };
  }
  async countToday() {
    return this.prisma.timetable_session.count({
      where: { dayOfWeek: new Date().getDay() },
    });
  }
};
exports.TimetableService = TimetableService;
exports.TimetableService = TimetableService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  TimetableService,
);
//# sourceMappingURL=timetable.service.js.map
