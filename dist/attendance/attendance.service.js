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
exports.AttendanceService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
const crypto_1 = require('crypto');
let AttendanceService = class AttendanceService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  generateShortCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    const bytes = (0, crypto_1.randomBytes)(6);
    for (let i = 0; i < 6; i++) {
      code += chars[bytes[i] % chars.length];
    }
    return code;
  }
  async assertCanCreateSession(dto, createdBy, requester) {
    const roles = requester.roles || [];
    if (roles.some((r) => ['ADMIN', 'SUPER_ADMIN'].includes(r))) return;
    const isTrainer = roles.some((r) => ['TRAINER', 'INSTRUCTOR'].includes(r));
    const isHubManager = roles.includes('HUB_MANAGER');
    if (isTrainer) {
      const instructor = await this.prisma.instructor.findUnique({
        where: { contactId: requester.contactId },
      });
      if (!instructor || instructor.hubId !== dto.hubId) {
        throw new common_1.ForbiddenException(
          'You can only create attendance sessions for your own hub',
        );
      }
      if (dto.courseId) {
        const course = await this.prisma.course.findUnique({
          where: { id: dto.courseId },
        });
        if (!course || course.instructorId !== instructor.id) {
          throw new common_1.ForbiddenException(
            'You can only create attendance sessions for courses you teach',
          );
        }
      }
      return;
    }
    if (isHubManager) {
      const manager = await this.prisma.user.findUnique({
        where: { id: createdBy },
      });
      if (!manager?.hubId || manager.hubId !== dto.hubId) {
        throw new common_1.ForbiddenException(
          'You can only create attendance sessions for your own hub',
        );
      }
      return;
    }
    throw new common_1.ForbiddenException(
      'You are not authorized to create attendance sessions',
    );
  }
  async createSession(dto, createdBy, requester) {
    await this.assertCanCreateSession(dto, createdBy, requester);
    const token = (0, crypto_1.randomBytes)(24).toString('hex');
    const shortCode = this.generateShortCode();
    const durationMinutes = dto.durationMinutes ?? 30;
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
    const session = await this.prisma.attendance_session.create({
      data: {
        token,
        shortCode,
        label: dto.label,
        courseId: dto.courseId,
        hubId: dto.hubId,
        expiresAt,
        createdBy,
      },
      include: {
        course: { select: { id: true, title: true } },
        hub: { select: { id: true, name: true } },
        _count: { select: { records: true } },
      },
    });
    return session;
  }
  async getSessions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      this.prisma.attendance_session.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true } },
          hub: { select: { id: true, name: true } },
          _count: {
            select: {
              records: { where: { method: { not: 'Absent' } } },
            },
          },
        },
      }),
      this.prisma.attendance_session.count(),
    ]);
    return { sessions, total, page, limit };
  }
  async getSession(id) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        hub: { select: { id: true, name: true } },
        records: {
          where: { method: { not: 'Absent' } },
          orderBy: { checkedInAt: 'asc' },
          include: {
            student: {
              select: {
                id: true,
                studentId: true,
                contact: {
                  select: {
                    person: { select: { firstName: true, lastName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!session) throw new common_1.NotFoundException('Session not found');
    return session;
  }
  async closeSession(id) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { id },
    });
    if (!session) throw new common_1.NotFoundException('Session not found');
    const closed = await this.prisma.attendance_session.update({
      where: { id },
      data: { isActive: false },
    });
    if (session.courseId) {
      const enrollmentWhere = {
        courseId: session.courseId,
        status: { in: ['Enrolled', 'InProgress'] },
      };
      if (session.hubId) enrollmentWhere.student = { hubId: session.hubId };
      const enrollments = await this.prisma.enrollment.findMany({
        where: enrollmentWhere,
        select: { studentId: true },
      });
      const enrolledIds = enrollments.map((e) => e.studentId);
      const checkedIn = await this.prisma.attendance_record.findMany({
        where: { sessionId: id },
        select: { studentId: true },
      });
      const presentSet = new Set(checkedIn.map((r) => r.studentId));
      const absentIds = enrolledIds.filter((sid) => !presentSet.has(sid));
      if (absentIds.length) {
        await this.prisma.attendance_record.createMany({
          data: absentIds.map((studentId) => ({
            sessionId: id,
            studentId,
            method: 'Absent',
          })),
          skipDuplicates: true,
        });
      }
    }
    return closed;
  }
  async checkIn(token, contactId) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { token },
    });
    if (!session) throw new common_1.NotFoundException('Invalid QR code');
    if (!session.isActive)
      throw new common_1.BadRequestException(
        'This attendance session is closed',
      );
    if (new Date() > session.expiresAt) {
      await this.prisma.attendance_session.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      throw new common_1.BadRequestException('This QR code has expired');
    }
    const student = await this.prisma.student.findUnique({
      where: { contactId },
      select: { id: true, studentId: true },
    });
    if (!student)
      throw new common_1.NotFoundException(
        'No student record found for your account',
      );
    try {
      const record = await this.prisma.attendance_record.create({
        data: {
          sessionId: session.id,
          studentId: student.id,
          method: 'QR',
        },
        include: {
          student: {
            select: {
              studentId: true,
              contact: {
                select: {
                  person: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      });
      return {
        success: true,
        message: 'Checked in successfully!',
        record,
        session: { id: session.id, label: session.label },
      };
    } catch (e) {
      if (e.code === 'P2002') {
        throw new common_1.ConflictException(
          'You have already checked in to this session',
        );
      }
      throw e;
    }
  }
  async checkInByCode(code, contactId) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { shortCode: code.toUpperCase().trim() },
    });
    if (!session)
      throw new common_1.NotFoundException(
        'Invalid code — please check and try again',
      );
    if (!session.isActive)
      throw new common_1.BadRequestException(
        'This attendance session is closed',
      );
    if (new Date() > session.expiresAt) {
      await this.prisma.attendance_session.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      throw new common_1.BadRequestException('This session code has expired');
    }
    const student = await this.prisma.student.findUnique({
      where: { contactId },
      select: { id: true, studentId: true },
    });
    if (!student)
      throw new common_1.NotFoundException(
        'No student record found for your account',
      );
    try {
      const record = await this.prisma.attendance_record.create({
        data: { sessionId: session.id, studentId: student.id, method: 'Code' },
        include: {
          student: {
            select: {
              studentId: true,
              contact: {
                select: {
                  person: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      });
      return {
        success: true,
        message: 'Checked in successfully!',
        record,
        session: { id: session.id, label: session.label },
      };
    } catch (e) {
      if (e.code === 'P2002') {
        throw new common_1.ConflictException(
          'You have already checked in to this session',
        );
      }
      throw e;
    }
  }
  async getSessionByToken(token) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { token },
      include: {
        course: { select: { id: true, title: true } },
        hub: { select: { id: true, name: true } },
        _count: {
          select: {
            records: { where: { method: { not: 'Absent' } } },
          },
        },
      },
    });
    if (!session) throw new common_1.NotFoundException('Invalid QR code');
    return session;
  }
  async addManual(sessionId, studentDbId) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new common_1.NotFoundException('Session not found');
    try {
      return await this.prisma.attendance_record.create({
        data: { sessionId, studentId: studentDbId, method: 'Manual' },
      });
    } catch (e) {
      if (e.code === 'P2002')
        throw new common_1.ConflictException('Student already checked in');
      throw e;
    }
  }
  async getStudentSummary(contactId, days = 7) {
    const student = await this.prisma.student.findFirst({
      where: { contactId: parseInt(contactId, 10) },
      select: { id: true },
    });
    const result = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const count = student
        ? await this.prisma.attendance_record.count({
            where: {
              studentId: student.id,
              checkedInAt: { gte: dayStart, lt: dayEnd },
            },
          })
        : 0;
      result.push({ date: dateStr, count });
    }
    return result;
  }
  async getStudentHistory(contactId) {
    const student = await this.prisma.student.findFirst({
      where: { contactId: parseInt(contactId, 10) },
      select: { id: true },
    });
    if (!student) return [];
    const records = await this.prisma.attendance_record.findMany({
      where: { studentId: student.id },
      orderBy: { checkedInAt: 'desc' },
      include: {
        session: {
          include: {
            course: { select: { title: true } },
          },
        },
      },
    });
    return records.map((r) => ({
      sessionId: r.sessionId,
      sessionLabel: r.session?.label ?? `Session #${r.sessionId}`,
      date: r.checkedInAt.toISOString().slice(0, 10),
      checkedInAt: r.checkedInAt.toISOString(),
      course: r.session?.course ? { title: r.session.course.title } : null,
      method: r.method,
    }));
  }
  async getStats(hubId, courseId) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const sessionWhere = {};
    if (hubId) sessionWhere.hubId = hubId;
    if (courseId) sessionWhere.courseId = courseId;
    const enrollmentWhere = { status: { not: 'Dropped' } };
    if (courseId) enrollmentWhere.courseId = courseId;
    if (hubId) enrollmentWhere.student = { hubId };
    const enrolled = await (courseId
      ? this.prisma.enrollment.count({ where: enrollmentWhere })
      : hubId
      ? this.prisma.student.count({ where: { hubId } })
      : this.prisma.student.count());
    const lastSession = await this.prisma.attendance_session.findFirst({
      where: { ...sessionWhere, isActive: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    });
    const presentLastSession = lastSession
      ? await this.prisma.attendance_record.count({
          where: { sessionId: lastSession.id, method: { not: 'Absent' } },
        })
      : 0;
    const sessionDate = lastSession?.createdAt
      ? new Date(lastSession.createdAt)
      : null;
    const sessionDayStart = sessionDate
      ? new Date(
          sessionDate.getFullYear(),
          sessionDate.getMonth(),
          sessionDate.getDate(),
        )
      : null;
    const isToday = sessionDayStart
      ? sessionDayStart.getTime() === startOfToday.getTime()
      : false;
    const daysAgo = sessionDayStart
      ? Math.round(
          (startOfToday.getTime() - sessionDayStart.getTime()) / 86400000,
        )
      : null;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const allEnrollments = await this.prisma.enrollment.findMany({
      where: enrollmentWhere,
      select: { studentId: true },
    });
    const enrolledStudentIds = [
      ...new Set(allEnrollments.map((e) => e.studentId)),
    ];
    const recentlyActive = await this.prisma.attendance_record.findMany({
      where: {
        studentId: { in: enrolledStudentIds },
        method: { not: 'Absent' },
        checkedInAt: { gte: cutoff },
      },
      select: { studentId: true },
      distinct: ['studentId'],
    });
    const activeSet = new Set(recentlyActive.map((r) => r.studentId));
    const inactive = enrolledStudentIds.filter(
      (id) => !activeSet.has(id),
    ).length;
    return {
      enrolled,
      presentLastSession,
      absentLastSession: Math.max(0, enrolled - presentLastSession),
      inactive,
      lastSessionDate: lastSession?.createdAt?.toISOString() ?? null,
      daysAgo,
      isToday,
    };
  }
  async getHubAttendanceStats() {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const [todayRecords, inactiveByHub] = await Promise.all([
      this.prisma.attendance_record.findMany({
        where: { checkedInAt: { gte: startOfToday, lt: startOfTomorrow } },
        include: { session: { select: { hubId: true } } },
        distinct: ['studentId'],
      }),
      this.prisma.student.groupBy({
        by: ['hubId'],
        where: { status: 'Inactive' },
        _count: { id: true },
      }),
    ]);
    const presentMap = new Map();
    for (const rec of todayRecords) {
      const hid = rec.session?.hubId;
      if (hid) presentMap.set(hid, (presentMap.get(hid) ?? 0) + 1);
    }
    const inactiveMap = new Map();
    for (const row of inactiveByHub) {
      if (row.hubId) inactiveMap.set(row.hubId, row._count.id);
    }
    return { presentMap, inactiveMap };
  }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  AttendanceService,
);
//# sourceMappingURL=attendance.service.js.map
