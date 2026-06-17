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
exports.DashboardService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let DashboardService = class DashboardService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async getStats() {
    const now = new Date();
    const startOfMonday = new Date(now);
    startOfMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    startOfMonday.setHours(0, 0, 0, 0);
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(
      startOfToday.getTime() + 24 * 60 * 60 * 1000,
    );
    const todayDow = now.getDay();
    const [
      totalStudents,
      newThisWeek,
      totalCourses,
      activeEnrollments,
      todayAttendance,
      todayClasses,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({
        where: { enrolledAt: { gte: startOfMonday } },
      }),
      this.prisma.course.count({ where: { isActive: true } }),
      this.prisma.enrollment.count({ where: { status: 'Enrolled' } }),
      this.prisma.attendance_record.count({
        where: { checkedInAt: { gte: startOfToday, lt: startOfTomorrow } },
      }),
      this.prisma.timetable_session.count({ where: { dayOfWeek: todayDow } }),
    ]);
    return {
      totalStudents,
      newThisWeek,
      todayClasses,
      pendingExams: 0,
      totalCourses,
      activeEnrollments,
      todayAttendance,
    };
  }
  async getHubStats() {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const [hubs, inactiveByHub, todayRecords] = await Promise.all([
      this.prisma.hub.findMany({
        include: { _count: { select: { students: true } } },
      }),
      this.prisma.student.groupBy({
        by: ['hubId'],
        where: { status: 'Inactive' },
        _count: { id: true },
      }),
      this.prisma.attendance_record.findMany({
        where: { checkedInAt: { gte: startOfToday, lt: startOfTomorrow } },
        include: { session: { select: { hubId: true } } },
        distinct: ['studentId'],
      }),
    ]);
    const inactiveMap = new Map();
    for (const row of inactiveByHub) {
      if (row.hubId) inactiveMap.set(row.hubId, row._count.id);
    }
    const presentMap = new Map();
    for (const rec of todayRecords) {
      const hid = rec.session?.hubId;
      if (hid) presentMap.set(hid, (presentMap.get(hid) ?? 0) + 1);
    }
    return hubs.map((h) => {
      const total = h._count.students;
      const inactive = inactiveMap.get(h.id) ?? 0;
      const presentToday = presentMap.get(h.id) ?? 0;
      return {
        hub: h.name,
        hubCode: h.code,
        studentCount: total,
        activeCount: total - inactive,
        inactive,
        presentToday,
        absentToday: Math.max(0, total - presentToday),
      };
    });
  }
  async getTopPerformers(hubId, limit = 10) {
    const [gradedSubs, enrollmentGroups] = await Promise.all([
      this.prisma.submission.findMany({
        where: {
          status: { in: ['Graded', 'Returned'] },
          score: { not: null },
          ...(hubId ? { student: { hubId } } : {}),
        },
        include: {
          assignment: {
            select: {
              maxScore: true,
              course: { select: { title: true } },
            },
          },
          student: { include: { contact: { include: { person: true } } } },
        },
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: {
          status: { not: 'Dropped' },
          ...(hubId ? { student: { hubId } } : {}),
        },
        _count: { studentId: true },
        orderBy: { _count: { studentId: 'desc' } },
        take: 2,
      }),
    ]);
    const topCourseIds = enrollmentGroups.map((e) => e.courseId);
    const courseDetails = topCourseIds.length
      ? await this.prisma.course.findMany({
          where: { id: { in: topCourseIds } },
          select: { id: true, title: true },
        })
      : [];
    const titleMap = new Map(courseDetails.map((c) => [c.id, c.title]));
    const gradeMap = new Map();
    for (const sub of gradedSubs) {
      const sid = sub.studentId;
      const maxScore = sub.assignment?.maxScore ?? 100;
      const pct = maxScore > 0 ? (sub.score / maxScore) * 100 : 0;
      if (!gradeMap.has(sid)) {
        const p = sub.student?.contact?.person;
        gradeMap.set(sid, {
          name:
            [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'Unknown',
          courseName: sub.assignment?.course?.title ?? '',
          scores: [],
        });
      }
      gradeMap.get(sid).scores.push(pct);
    }
    const topStudents = Array.from(gradeMap.values())
      .map(({ name, courseName, scores }) => ({
        name,
        courseName,
        avgGrade: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        submissionCount: scores.length,
      }))
      .sort((a, b) => b.avgGrade - a.avgGrade)
      .slice(0, limit);
    return {
      topStudents,
      topCourses: enrollmentGroups.map((e) => ({
        name: titleMap.get(e.courseId) ?? 'Unknown',
        enrolledCount: e._count.studentId,
      })),
    };
  }
  async getAllPerformance(opts) {
    const { hubId, courseId, instructorContactId, limit = 200 } = opts;
    let courseIds;
    if (instructorContactId) {
      const instructor = await this.prisma.instructor.findFirst({
        where: { contactId: instructorContactId },
        select: { id: true },
      });
      if (instructor) {
        const trainerCourses = await this.prisma.course.findMany({
          where: { instructorId: instructor.id },
          select: { id: true },
        });
        courseIds = trainerCourses.map((c) => c.id);
      } else {
        courseIds = [];
      }
    } else if (courseId) {
      courseIds = [courseId];
    }
    const gradedSubs = await this.prisma.submission.findMany({
      where: {
        status: { in: ['Graded', 'Returned'] },
        score: { not: null },
        ...(hubId ? { student: { hubId } } : {}),
        ...(courseIds !== undefined
          ? { assignment: { courseId: { in: courseIds } } }
          : {}),
      },
      include: {
        assignment: {
          select: {
            maxScore: true,
            course: { select: { title: true } },
          },
        },
        student: {
          include: {
            contact: { include: { person: true } },
            hub: { select: { name: true } },
          },
        },
      },
    });
    const studentMap = new Map();
    for (const sub of gradedSubs) {
      const sid = sub.studentId;
      const maxScore = sub.assignment?.maxScore ?? 100;
      const pct = maxScore > 0 ? (sub.score / maxScore) * 100 : 0;
      if (!studentMap.has(sid)) {
        const p = sub.student?.contact?.person;
        studentMap.set(sid, {
          name:
            [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'Unknown',
          courseName: sub.assignment?.course?.title ?? '',
          hubName: sub.student?.hub?.name ?? '',
          scores: [],
          submissionCount: 0,
        });
      }
      const entry = studentMap.get(sid);
      entry.scores.push(pct);
      entry.submissionCount++;
    }
    const students = Array.from(studentMap.values())
      .map(({ name, courseName, hubName, scores, submissionCount }) => ({
        name,
        courseName,
        hubName,
        avgGrade: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        submissionCount,
      }))
      .sort((a, b) => b.avgGrade - a.avgGrade)
      .slice(0, limit);
    return { students };
  }
  async getSummary(_user) {
    const stats = await this.getStats();
    return {
      overview: {
        totalStudents: stats.totalStudents,
        newThisWeek: stats.newThisWeek,
        totalCourses: stats.totalCourses,
        activeEnrollments: stats.activeEnrollments,
      },
    };
  }
  async getHubManagerStats(hubId) {
    const now = new Date();
    const todayDow = now.getDay();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const [
      hub,
      totalStudents,
      activeStudents,
      totalCourses,
      classesToday,
      todayAttendance,
      recentStudents,
      courses,
    ] = await Promise.all([
      this.prisma.hub.findUnique({ where: { id: hubId } }),
      this.prisma.student.count({ where: { hubId } }),
      this.prisma.student.count({ where: { hubId, status: 'Active' } }),
      this.prisma.enrollment
        .findMany({
          where: { student: { hubId }, status: { not: 'Dropped' } },
          select: { courseId: true },
          distinct: ['courseId'],
        })
        .then((rows) => rows.length),
      this.prisma.timetable_session.count({
        where: { hubId, dayOfWeek: todayDow },
      }),
      this.prisma.attendance_record.count({
        where: {
          session: { hubId },
          checkedInAt: { gte: startOfToday, lt: startOfTomorrow },
        },
      }),
      this.prisma.student.findMany({
        where: { hubId },
        include: {
          contact: { include: { person: true } },
          enrollments: { include: { course: true }, take: 1 },
        },
        orderBy: { enrolledAt: 'desc' },
        take: 5,
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: { student: { hubId }, status: { not: 'Dropped' } },
        _count: { studentId: true },
        orderBy: { _count: { studentId: 'desc' } },
      }),
    ]);
    const courseIds = courses.map((e) => e.courseId);
    const courseDetails = courseIds.length
      ? await this.prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, title: true },
        })
      : [];
    const courseTitleMap = new Map(courseDetails.map((c) => [c.id, c.title]));
    return {
      hubId,
      hubName: hub?.name ?? 'Your Hub',
      totalStudents,
      activeStudents,
      inactiveStudents: totalStudents - activeStudents,
      totalCourses,
      classesToday,
      todayAttendance,
      courses: courses.map((e) => ({
        id: e.courseId,
        name: courseTitleMap.get(e.courseId) ?? 'Unknown',
        enrolled: e._count.studentId,
      })),
      recentStudents: recentStudents.map((s) => ({
        id: s.id,
        name: [s.contact?.person?.firstName, s.contact?.person?.lastName]
          .filter(Boolean)
          .join(' '),
        status: s.status,
        course: s.enrollments[0]?.course?.title ?? null,
        enrolledAt: s.enrolledAt,
      })),
      ...(await this.getTopPerformers(hubId)),
    };
  }
  async getReportStats() {
    const [studentsByStatus, enrollmentsByStatus, topCourses, hubStats] =
      await Promise.all([
        this.prisma.student.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        this.prisma.enrollment.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        this.prisma.course.findMany({
          select: {
            title: true,
            _count: { select: { enrollments: true } },
          },
          orderBy: { enrollments: { _count: 'desc' } },
          take: 8,
        }),
        this.prisma.hub.findMany({
          select: {
            name: true,
            _count: { select: { students: true } },
          },
          orderBy: { students: { _count: 'desc' } },
        }),
      ]);
    return {
      studentsByStatus: studentsByStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
      enrollmentsByStatus: enrollmentsByStatus.map((e) => ({
        status: e.status,
        count: e._count.id,
      })),
      enrollmentsByCourse: topCourses.map((c) => ({
        course: c.title,
        count: c._count.enrollments,
      })),
      studentsByHub: hubStats.map((h) => ({
        hub: h.name,
        count: h._count.students,
      })),
    };
  }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  DashboardService,
);
//# sourceMappingURL=dashboard.service.js.map
