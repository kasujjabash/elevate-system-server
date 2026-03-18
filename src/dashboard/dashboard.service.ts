import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalStudents, newThisWeek, totalCourses, activeEnrollments] =
      await Promise.all([
        this.prisma.student.count(),
        this.prisma.student.count({ where: { enrolledAt: { gte: weekAgo } } }),
        this.prisma.course.count({ where: { isActive: true } }),
        this.prisma.enrollment.count({ where: { status: 'Enrolled' } }),
      ]);

    return {
      totalStudents,
      newThisWeek,
      todayClasses: 0,
      pendingExams: 0,
      totalCourses,
      activeEnrollments,
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
}
