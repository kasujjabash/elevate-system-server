import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent(studentId: number, courseId: number) {
    // Check if student is already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course');
    }

    // Check course capacity
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (
      course &&
      course.maxStudents &&
      course._count.enrollments >= course.maxStudents
    ) {
      throw new Error('Course is at full capacity');
    }

    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'Enrolled',
      },
      include: {
        student: {
          include: {
            contact: {
              include: {
                person: true,
              },
            },
          },
        },
        course: {
          include: {
            skillCategory: true,
            hub: true,
          },
        },
      },
    });
  }

  async updateEnrollmentProgress(
    studentId: number,
    courseId: number,
    progress: number,
  ) {
    return this.prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      data: { progress },
    });
  }

  async completeEnrollment(studentId: number, courseId: number) {
    return this.prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      data: {
        status: 'Completed',
        completedAt: new Date(),
        progress: 100,
      },
    });
  }

  async dropEnrollment(studentId: number, courseId: number) {
    return this.prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      data: {
        status: 'Dropped',
      },
    });
  }

  async getEnrollmentsByCourse(courseId: number) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          include: {
            contact: {
              include: {
                person: true,
              },
            },
          },
        },
      },
    });
  }
}
