import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CommunityReachService } from '../community-reach/community-reach.service';
import { JobPlacementsService } from '../job-placements/job-placements.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private communityReachService: CommunityReachService,
    private jobPlacementsService: JobPlacementsService,
    private attendanceService: AttendanceService,
  ) {}

  async getStats() {
    const now = new Date();

    // Start of current Monday (week boundary for newThisWeek)
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

    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      totalStudents,
      newThisWeek,
      totalCourses,
      activeEnrollments,
      todayAttendance,
      todayClasses,
      activeStudentGroups,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({
        where: { enrolledAt: { gte: startOfMonday } },
      }),
      this.prisma.course.count({ where: { isActive: true } }),
      this.prisma.enrollment.count({ where: { status: 'Enrolled' } }),
      this.prisma.attendance_record
        .findMany({
          where: {
            checkedInAt: { gte: startOfToday, lt: startOfTomorrow },
            method: { not: 'Absent' },
          },
          select: { studentId: true },
          distinct: ['studentId'],
        })
        .then((r) => r.length),
      this.prisma.timetable_session.count({ where: { dayOfWeek: todayDow } }),
      this.prisma.attendance_record.groupBy({
        by: ['studentId'],
        where: {
          checkedInAt: { gte: fourteenDaysAgo },
          method: { not: 'Absent' },
        },
        _count: { studentId: true },
        having: { studentId: { _count: { gte: 2 } } },
      }),
    ]);

    // Build attendanceInfo: use today's count if >0, else fall back to last session
    let attendanceInfo: {
      presentCount: number;
      date: string;
      daysAgo: number;
      isToday: boolean;
    };
    if (todayAttendance > 0) {
      attendanceInfo = {
        presentCount: todayAttendance,
        date: startOfToday.toISOString().split('T')[0],
        daysAgo: 0,
        isToday: true,
      };
    } else {
      const lastRecord = await this.prisma.attendance_record.findFirst({
        where: { method: { not: 'Absent' } },
        orderBy: { checkedInAt: 'desc' },
        select: { checkedInAt: true },
      });
      if (lastRecord) {
        const ld = new Date(lastRecord.checkedInAt);
        const ldStart = new Date(ld.getFullYear(), ld.getMonth(), ld.getDate());
        const ldEnd = new Date(ldStart.getTime() + 86400000);
        const daysAgo = Math.round(
          (startOfToday.getTime() - ldStart.getTime()) / 86400000,
        );
        const lastDayCount = await this.prisma.attendance_record
          .findMany({
            where: {
              checkedInAt: { gte: ldStart, lt: ldEnd },
              method: { not: 'Absent' },
            },
            select: { studentId: true },
            distinct: ['studentId'],
          })
          .then((r) => r.length);
        attendanceInfo = {
          presentCount: lastDayCount,
          date: ldStart.toISOString().split('T')[0],
          daysAgo,
          isToday: daysAgo === 0,
        };
      } else {
        attendanceInfo = {
          presentCount: 0,
          date: startOfToday.toISOString().split('T')[0],
          daysAgo: 0,
          isToday: true,
        };
      }
    }

    return {
      totalStudents,
      newThisWeek,
      todayClasses,
      pendingExams: 0,
      totalCourses,
      activeEnrollments,
      todayAttendance,
      attendanceInfo,
      activeStudents: activeStudentGroups.length,
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
        where: { status: { in: ['OnBreak', 'Dropped'] } },
        _count: { id: true },
      }),
      this.prisma.attendance_record.findMany({
        where: {
          checkedInAt: { gte: startOfToday, lt: startOfTomorrow },
          method: { not: 'Absent' },
        },
        include: { session: { select: { hubId: true } } },
        distinct: ['studentId'],
      }),
    ]);

    const inactiveMap = new Map<number, number>();
    for (const row of inactiveByHub) {
      if (row.hubId) inactiveMap.set(row.hubId, row._count.id);
    }

    const presentMap = new Map<number, number>();
    for (const rec of todayRecords) {
      const hid = (rec.session as any)?.hubId;
      if (hid) presentMap.set(hid, (presentMap.get(hid) ?? 0) + 1);
    }

    // For each hub, build attendanceInfo (fall back to last session when no check-ins today)
    const todayStr = startOfToday.toISOString().split('T')[0];
    const hubAttendanceInfo = new Map<
      number,
      { presentCount: number; date: string; daysAgo: number; isToday: boolean }
    >();
    await Promise.all(
      hubs.map(async (h) => {
        const presentToday = presentMap.get(h.id) ?? 0;
        if (presentToday > 0) {
          hubAttendanceInfo.set(h.id, {
            presentCount: presentToday,
            date: todayStr,
            daysAgo: 0,
            isToday: true,
          });
        } else {
          const lastSession = await this.prisma.attendance_session.findFirst({
            where: { hubId: h.id, isActive: false },
            orderBy: { createdAt: 'desc' },
            select: { id: true, createdAt: true },
          });
          if (lastSession) {
            const sd = new Date(lastSession.createdAt);
            const sdStart = new Date(
              sd.getFullYear(),
              sd.getMonth(),
              sd.getDate(),
            );
            const daysAgo = Math.round(
              (startOfToday.getTime() - sdStart.getTime()) / 86400000,
            );
            const count = await this.prisma.attendance_record.count({
              where: { sessionId: lastSession.id, method: { not: 'Absent' } },
            });
            hubAttendanceInfo.set(h.id, {
              presentCount: count,
              date: sdStart.toISOString().split('T')[0],
              daysAgo,
              isToday: daysAgo === 0,
            });
          } else {
            hubAttendanceInfo.set(h.id, {
              presentCount: 0,
              date: todayStr,
              daysAgo: 0,
              isToday: true,
            });
          }
        }
      }),
    );

    return hubs.map((h) => {
      const total = h._count.students;
      const inactive = inactiveMap.get(h.id) ?? 0;
      const presentToday = presentMap.get(h.id) ?? 0;
      const attendanceInfo = hubAttendanceInfo.get(h.id) ?? {
        presentCount: 0,
        date: todayStr,
        daysAgo: 0,
        isToday: true,
      };
      return {
        hub: h.name,
        hubCode: h.code,
        studentCount: total,
        activeCount: total - inactive,
        inactive,
        presentToday,
        absentToday: Math.max(0, total - presentToday),
        attendanceInfo,
      };
    });
  }

  async getTopPerformers(hubId?: number, limit = 10) {
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
      // Group enrollments by course, scoped to hub when provided
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

    // Resolve course titles for the top enrollment groups
    const topCourseIds = enrollmentGroups.map((e) => e.courseId);
    const courseDetails = topCourseIds.length
      ? await this.prisma.course.findMany({
          where: { id: { in: topCourseIds } },
          select: { id: true, title: true },
        })
      : [];
    const titleMap = new Map(courseDetails.map((c) => [c.id, c.title]));

    // Aggregate per-student avg grade
    const gradeMap = new Map<
      number,
      { name: string; courseName: string; scores: number[] }
    >();
    for (const sub of gradedSubs) {
      const sid = sub.studentId;
      const maxScore = (sub.assignment?.maxScore as number) ?? 100;
      const pct = maxScore > 0 ? (sub.score! / maxScore) * 100 : 0;
      if (!gradeMap.has(sid)) {
        const p = sub.student?.contact?.person;
        gradeMap.set(sid, {
          name:
            [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'Unknown',
          courseName: (sub.assignment as any)?.course?.title ?? '',
          scores: [],
        });
      }
      gradeMap.get(sid)!.scores.push(pct);
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

  async getAllPerformance(opts: {
    hubId?: number;
    courseId?: number;
    instructorContactId?: number;
    limit?: number;
  }) {
    const { hubId, courseId, instructorContactId, limit = 200 } = opts;

    let courseIds: number[] | undefined;
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

    const studentMap = new Map<
      number,
      {
        name: string;
        courseName: string;
        hubName: string;
        scores: number[];
        submissionCount: number;
      }
    >();

    for (const sub of gradedSubs) {
      const sid = sub.studentId;
      const maxScore = (sub.assignment?.maxScore as number) ?? 100;
      const pct = maxScore > 0 ? (sub.score! / maxScore) * 100 : 0;
      if (!studentMap.has(sid)) {
        const p = sub.student?.contact?.person;
        studentMap.set(sid, {
          name:
            [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'Unknown',
          courseName: (sub.assignment as any)?.course?.title ?? '',
          hubName: (sub.student as any)?.hub?.name ?? '',
          scores: [],
          submissionCount: 0,
        });
      }
      const entry = studentMap.get(sid)!;
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

  async getSummary(_user: any) {
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

  async getHubManagerStats(hubId: number) {
    const now = new Date();
    const todayDow = now.getDay();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch hub student IDs for the attendance-based active count
    const hubStudentIds = await this.prisma.student
      .findMany({ where: { hubId }, select: { id: true } })
      .then((rows) => rows.map((r) => r.id));

    const [
      hub,
      totalStudents,
      activeStudentGroups,
      totalCourses,
      classesToday,
      todayAttendance,
      recentStudents,
      courses,
    ] = await Promise.all([
      this.prisma.hub.findUnique({ where: { id: hubId } }),
      this.prisma.student.count({ where: { hubId } }),
      this.prisma.attendance_record.groupBy({
        by: ['studentId'],
        where: {
          studentId: { in: hubStudentIds },
          checkedInAt: { gte: fourteenDaysAgo },
          method: { not: 'Absent' },
        },
        _count: { studentId: true },
        having: { studentId: { _count: { gte: 2 } } },
      }),
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
      this.prisma.attendance_record
        .findMany({
          where: {
            session: { hubId },
            checkedInAt: { gte: startOfToday, lt: startOfTomorrow },
            method: { not: 'Absent' },
          },
          select: { studentId: true },
          distinct: ['studentId'],
        })
        .then((r) => r.length),
      this.prisma.student.findMany({
        where: { hubId },
        include: {
          contact: { include: { person: true } },
          enrollments: { include: { course: true }, take: 1 },
        },
        orderBy: { enrolledAt: 'desc' },
        take: 5,
      }),
      // Courses that hub students are actually enrolled in (not just courses tagged to this hub)
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: { student: { hubId }, status: { not: 'Dropped' } },
        _count: { studentId: true },
        orderBy: { _count: { studentId: 'desc' } },
      }),
    ]);

    // Resolve course titles for the enrollment groups
    const courseIds = (courses as any[]).map((e: any) => e.courseId);
    const courseDetails = courseIds.length
      ? await this.prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, title: true },
        })
      : [];
    const courseTitleMap = new Map(courseDetails.map((c) => [c.id, c.title]));

    // Build hub attendanceInfo — fall back to last session if no check-ins today
    let hubAttendanceInfo: {
      presentCount: number;
      date: string;
      daysAgo: number;
      isToday: boolean;
    };
    if (todayAttendance > 0) {
      hubAttendanceInfo = {
        presentCount: todayAttendance,
        date: startOfToday.toISOString().split('T')[0],
        daysAgo: 0,
        isToday: true,
      };
    } else {
      const lastSession = await this.prisma.attendance_session.findFirst({
        where: { hubId, isActive: false },
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true },
      });
      if (lastSession) {
        const sd = new Date(lastSession.createdAt);
        const sdStart = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate());
        const daysAgo = Math.round(
          (startOfToday.getTime() - sdStart.getTime()) / 86400000,
        );
        const count = await this.prisma.attendance_record.count({
          where: { sessionId: lastSession.id, method: { not: 'Absent' } },
        });
        hubAttendanceInfo = {
          presentCount: count,
          date: sdStart.toISOString().split('T')[0],
          daysAgo,
          isToday: daysAgo === 0,
        };
      } else {
        hubAttendanceInfo = {
          presentCount: 0,
          date: startOfToday.toISOString().split('T')[0],
          daysAgo: 0,
          isToday: true,
        };
      }
    }

    const activeStudents = activeStudentGroups.length;
    return {
      hubId,
      hubName: hub?.name ?? 'Your Hub',
      totalStudents,
      activeStudents,
      inactiveStudents: totalStudents - activeStudents,
      totalCourses,
      classesToday,
      todayAttendance,
      attendanceInfo: hubAttendanceInfo,
      courses: (courses as any[]).map((e: any) => ({
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

  private async getTotalContacts(): Promise<number> {
    return this.prisma.contact.count();
  }

  // Scoped to students only (org-wide or one hub) — never counts staff contacts.
  private async getGenderBreakdown(hubId?: number) {
    const rows = await this.prisma.person.groupBy({
      by: ['gender'],
      _count: { id: true },
      where: {
        contact: {
          student: hubId ? { hubId } : { isNot: null },
        },
      },
    });
    return rows.map((r) => ({ gender: r.gender, count: r._count.id }));
  }

  private async getCompletionByStatus(hubId?: number) {
    const rows = await this.prisma.student.groupBy({
      by: ['status'],
      _count: { id: true },
      where: hubId ? { hubId } : undefined,
    });
    return rows.map((r) => ({ status: r.status, count: r._count.id }));
  }

  // Per-course completion rate + average online-course progress
  private async getCourseCompletion(hubId?: number, courseId?: number) {
    const rows = await this.prisma.enrollment.groupBy({
      by: ['courseId', 'status'],
      _count: { id: true },
      _avg: { progress: true },
      where: {
        ...(courseId ? { courseId } : {}),
        ...(hubId ? { student: { hubId } } : {}),
      },
    });

    const courseIds = [...new Set(rows.map((r) => r.courseId))];
    const courses = courseIds.length
      ? await this.prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, title: true },
        })
      : [];
    const titleMap = new Map(courses.map((c) => [c.id, c.title]));

    const byCourse = new Map<
      number,
      {
        courseName: string;
        total: number;
        completed: number;
        progressSum: number;
        progressCount: number;
      }
    >();
    for (const r of rows) {
      if (!byCourse.has(r.courseId)) {
        byCourse.set(r.courseId, {
          courseName: titleMap.get(r.courseId) ?? 'Unknown',
          total: 0,
          completed: 0,
          progressSum: 0,
          progressCount: 0,
        });
      }
      const entry = byCourse.get(r.courseId)!;
      entry.total += r._count.id;
      if (r.status === 'Completed') entry.completed += r._count.id;
      if (r._avg.progress != null) {
        entry.progressSum += r._avg.progress * r._count.id;
        entry.progressCount += r._count.id;
      }
    }

    return Array.from(byCourse.entries()).map(([id, v]) => ({
      courseId: id,
      courseName: v.courseName,
      totalEnrolled: v.total,
      completedCount: v.completed,
      completionRate: v.total ? Math.round((v.completed / v.total) * 100) : 0,
      avgProgress: v.progressCount
        ? Math.round(v.progressSum / v.progressCount)
        : 0,
    }));
  }

  // Per-course average grade rollup (org/hub/course-scoped)
  private async getGradeRollup(hubId?: number, courseId?: number) {
    const gradedSubs = await this.prisma.submission.findMany({
      where: {
        status: { in: ['Graded', 'Returned'] },
        score: { not: null },
        ...(hubId ? { student: { hubId } } : {}),
        ...(courseId ? { assignment: { courseId } } : {}),
      },
      select: {
        score: true,
        assignment: {
          select: {
            maxScore: true,
            courseId: true,
            course: { select: { title: true } },
          },
        },
      },
    });

    const byCourse = new Map<
      number,
      { courseName: string; scores: number[] }
    >();
    for (const sub of gradedSubs) {
      const cid = sub.assignment?.courseId;
      if (!cid) continue;
      const maxScore = sub.assignment?.maxScore ?? 100;
      const pct = maxScore > 0 ? (sub.score! / maxScore) * 100 : 0;
      if (!byCourse.has(cid)) {
        byCourse.set(cid, {
          courseName: sub.assignment?.course?.title ?? 'Unknown',
          scores: [],
        });
      }
      byCourse.get(cid)!.scores.push(pct);
    }

    return Array.from(byCourse.entries())
      .map(([id, v]) => ({
        courseId: id,
        courseName: v.courseName,
        avgGrade: Math.round(
          v.scores.reduce((a, b) => a + b, 0) / v.scores.length,
        ),
        submissionCount: v.scores.length,
      }))
      .sort((a, b) => b.avgGrade - a.avgGrade);
  }

  // Students who attended >=2 sessions in the last 14 days — same "active"
  // definition as getStats().activeStudents (a count on the home dashboard),
  // but returning the actual student list (name, hub, course) for display here.
  private async getActiveStudentsList(
    hubId?: number,
    courseId?: number,
    limit = 100,
  ) {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const activeGroups = await this.prisma.attendance_record.groupBy({
      by: ['studentId'],
      where: {
        checkedInAt: { gte: fourteenDaysAgo },
        method: { not: 'Absent' },
        ...(hubId ? { student: { hubId } } : {}),
        ...(courseId ? { session: { courseId } } : {}),
      },
      _count: { studentId: true },
      having: { studentId: { _count: { gte: 2 } } },
    });

    const studentIds = activeGroups.map((g) => g.studentId);
    if (!studentIds.length) return [];

    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
      take: limit,
      include: {
        contact: { include: { person: true } },
        hub: { select: { name: true } },
        enrollments: { include: { course: true }, take: 1 },
      },
    });

    return students.map((s) => ({
      id: s.id,
      name:
        [s.contact?.person?.firstName, s.contact?.person?.lastName]
          .filter(Boolean)
          .join(' ') || 'Unknown',
      hub: s.hub?.name ?? null,
      course: s.enrollments[0]?.course?.title ?? null,
    }));
  }

  // Enrolled students with zero present attendance in the last 14 days —
  // same "inactive" definition already used in AttendanceService.getStats().
  private async getInactiveStudentsList(
    hubId?: number,
    courseId?: number,
    limit = 100,
  ) {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const enrollmentWhere: any = { status: { not: 'Dropped' } };
    if (courseId) enrollmentWhere.courseId = courseId;
    if (hubId) enrollmentWhere.student = { hubId };

    const allEnrollments = await this.prisma.enrollment.findMany({
      where: enrollmentWhere,
      select: { studentId: true },
    });
    const enrolledStudentIds = [
      ...new Set(allEnrollments.map((e) => e.studentId)),
    ];
    if (!enrolledStudentIds.length) return [];

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
    const inactiveIds = enrolledStudentIds.filter((id) => !activeSet.has(id));
    if (!inactiveIds.length) return [];

    const students = await this.prisma.student.findMany({
      where: { id: { in: inactiveIds } },
      take: limit,
      include: {
        contact: { include: { person: true } },
        hub: { select: { name: true } },
        enrollments: { include: { course: true }, take: 1 },
      },
    });

    return students.map((s) => ({
      id: s.id,
      name:
        [s.contact?.person?.firstName, s.contact?.person?.lastName]
          .filter(Boolean)
          .join(' ') || 'Unknown',
      hub: s.hub?.name ?? null,
      course: s.enrollments[0]?.course?.title ?? null,
    }));
  }

  private async getRecentlyRegisteredStudents(hubId?: number, limit = 10) {
    const students = await this.prisma.student.findMany({
      where: hubId ? { hubId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        contact: { include: { person: true } },
        hub: { select: { name: true } },
      },
    });
    return students.map((s) => ({
      id: s.id,
      name:
        [s.contact?.person?.firstName, s.contact?.person?.lastName]
          .filter(Boolean)
          .join(' ') || 'Unknown',
      hub: s.hub?.name ?? null,
      status: s.status,
      createdAt: s.createdAt,
    }));
  }

  // Job-placement gender split + recently-placed list, hub/course-scoped
  private async getPlacementBreakdown(
    hubId?: number,
    courseId?: number,
    limit = 10,
  ) {
    const where: any = { isActive: true };
    if (hubId) where.hubId = hubId;
    if (courseId) where.courseId = courseId;

    const [genderGroups, recent] = await Promise.all([
      this.prisma.job_placement.groupBy({
        by: ['gender'],
        _count: { id: true },
        where,
      }),
      this.prisma.job_placement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          course: { select: { title: true } },
          hub: { select: { name: true } },
        },
      }),
    ]);

    return {
      genderBreakdown: genderGroups.map((g) => ({
        gender: g.gender ?? 'Unknown',
        count: g._count.id,
      })),
      recentlyPlaced: recent.map((p) => ({
        id: p.id,
        name: p.fullName,
        placementType: p.placementType,
        jobTitle: p.jobTitle,
        companyName: p.companyName,
        course: p.course?.title ?? null,
        hub: p.hub?.name ?? null,
        createdAt: p.createdAt,
      })),
    };
  }

  // Sum of salaryAfterProgram across job placements logged since Jan 1 of the
  // current year — a simple "wages currently earned by this year's graduates"
  // figure, hub/course-scoped like the rest of the job-placement breakdowns.
  private async getTotalWagesThisYear(hubId?: number, courseId?: number) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const result = await this.prisma.job_placement.aggregate({
      _sum: { salaryAfterProgram: true },
      where: {
        isActive: true,
        createdAt: { gte: startOfYear },
        salaryAfterProgram: { not: null },
        ...(hubId ? { hubId } : {}),
        ...(courseId ? { courseId } : {}),
      },
    });

    return result._sum.salaryAfterProgram ?? 0;
  }

  // Consolidated admin report — everything the rebuilt admin dashboard needs
  // in one call, optionally scoped to a hub and/or course.
  async getAdminReport(hubId?: number, courseId?: number) {
    const [
      stats,
      hubStats,
      reportStats,
      performers,
      allPerformance,
      communityReach,
      jobPlacements,
      attendance,
      totalContacts,
      genderBreakdown,
      completionByStatus,
      courseCompletion,
      gradeRollup,
      recentStudents,
      placementBreakdown,
      activeStudentsList,
      inactiveStudentsList,
      totalWagesThisYear,
    ] = await Promise.all([
      this.getStats(),
      this.getHubStats(),
      this.getReportStats(),
      this.getTopPerformers(hubId),
      this.getAllPerformance({ hubId, courseId, limit: 10 }),
      this.communityReachService.getStats(),
      this.jobPlacementsService.getStats(),
      this.attendanceService.getStats(hubId, courseId),
      this.getTotalContacts(),
      this.getGenderBreakdown(hubId),
      this.getCompletionByStatus(hubId),
      this.getCourseCompletion(hubId, courseId),
      this.getGradeRollup(hubId, courseId),
      this.getRecentlyRegisteredStudents(hubId),
      this.getPlacementBreakdown(hubId, courseId),
      this.getActiveStudentsList(hubId, courseId),
      this.getInactiveStudentsList(hubId, courseId),
      this.getTotalWagesThisYear(hubId, courseId),
    ]);

    return {
      totals: {
        totalStudents: stats.totalStudents,
        totalCourses: stats.totalCourses,
        activeEnrollments: stats.activeEnrollments,
        activeStudents: stats.activeStudents,
        totalContacts,
        totalCommunityReach: communityReach.total,
        // Youth reached = community outreach contacts + enrolled students
        totalYouthReached: communityReach.total + stats.totalStudents,
        totalJobPlacements: jobPlacements.total,
        totalWagesThisYear,
      },
      activeStudentsList,
      inactiveStudentsList,
      attendance: {
        ...attendance,
        byHub: hubStats.map((h) => ({
          hub: h.hub,
          hubCode: h.hubCode,
          presentToday: h.presentToday,
          absentToday: h.absentToday,
        })),
      },
      hubs: hubStats,
      enrollment: {
        byCourse: reportStats.enrollmentsByCourse,
        byStatus: reportStats.enrollmentsByStatus,
        byHub: reportStats.studentsByHub,
      },
      completion: {
        byStudentStatus: completionByStatus,
        byCourse: courseCompletion,
      },
      performance: {
        topStudents: performers.topStudents,
        topCourses: performers.topCourses,
        allStudents: allPerformance.students,
        byCourse: gradeRollup,
      },
      jobPlacements: {
        ...jobPlacements,
        ...placementBreakdown,
      },
      communityReach,
      demographics: {
        gender: genderBreakdown,
      },
      recentStudents,
    };
  }
}
