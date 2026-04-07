import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    from?: string;
    to?: string;
    hubId?: string;
    courseId?: string;
    limit: number;
    skip: number;
  }) {
    // Return empty array for now — classes/timetable not yet in schema
    return [];
  }

  // Returns student's enrolled courses as timetable entries
  async getTimetable(studentId?: string, contactId?: string) {
    const where: any = {};

    if (studentId || contactId) {
      const rawId = studentId || contactId!;
      const parsed = parseInt(rawId, 10);
      if (isNaN(parsed)) return [];

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
          student = await this.prisma.student.findFirst({
            where: { contactId: user.contactId },
            select: { id: true },
          });
        }
      }
      if (!student) return [];
      where.studentId = student.id;
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        course: {
          include: {
            hub: true,
            instructor: { include: { contact: { include: { person: true } } } },
          },
        },
      },
    });

    return enrollments.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      title: e.course.title,
      hub: e.course.hub?.name ?? '',
      location: e.course.hub?.location ?? '',
      instructor: e.course.instructor
        ? `${e.course.instructor.contact?.person?.firstName} ${e.course.instructor.contact?.person?.lastName}`
        : null,
      status: e.status,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
    }));
  }

  async create(dto: any) {
    return { ...dto, id: 'new', createdAt: new Date() };
  }

  async getMetricsRaw(from?: string, to?: string) {
    const [totalStudents, totalEnrollments] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.enrollment.count(),
    ]);

    return [
      {
        id: 'summary',
        categoryId: 'course',
        attendance: 0,
        metaData: {
          tuitionFees: 0,
          noOfCertifications: 0,
          noOfEnrollments: totalEnrollments,
          noOfInstructors: 0,
          totalCourseAttendance: 0,
          totalClassAttendance: 0,
          totalStudents,
        },
      },
    ];
  }
}
