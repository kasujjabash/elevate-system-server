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
exports.EnrollmentService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let EnrollmentService = class EnrollmentService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async enrollStudent(studentId, courseId) {
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
  async updateEnrollmentProgress(studentId, courseId, progress) {
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
  async completeEnrollment(studentId, courseId) {
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
  async dropEnrollment(studentId, courseId) {
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
  async getEnrollmentsByCourse(courseId) {
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
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  EnrollmentService,
);
//# sourceMappingURL=enrollment.service.js.map
