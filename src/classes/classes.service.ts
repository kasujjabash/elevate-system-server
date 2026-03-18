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
