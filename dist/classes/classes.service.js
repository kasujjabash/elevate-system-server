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
exports.ClassesService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let ClassesService = class ClassesService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async findAll(filters) {
    return [];
  }
  async getTimetable(studentId, contactId) {
    const where = {};
    if (studentId || contactId) {
      const rawId = studentId || contactId;
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
  async create(dto) {
    return { ...dto, id: 'new', createdAt: new Date() };
  }
  async getMetricsRaw(from, to) {
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
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  ClassesService,
);
//# sourceMappingURL=classes.service.js.map
