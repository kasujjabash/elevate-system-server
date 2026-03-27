import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

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
    const hubs = await this.prisma.hub.findMany({
      include: {
        _count: { select: { students: true } },
      },
    });

    return hubs.map((h) => ({
      hub: h.name,
      hubCode: h.code,
      studentCount: h._count.students,
      activeCount: h._count.students,
    }));
  }

  async getTopPerformers() {
    const topEnrolledCourse = await this.prisma.course.findFirst({
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { enrollments: { _count: 'desc' } },
    });

    return {
      topStudent: null,
      topCourse: topEnrolledCourse
        ? {
            name: topEnrolledCourse.title,
            enrolledCount: topEnrolledCourse._count.enrollments,
            avgScore: 0,
          }
        : null,
    };
  }

  async getSummary(user: any) {
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
}
