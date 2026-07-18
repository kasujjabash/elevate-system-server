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
exports.CoursesService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let CoursesService = class CoursesService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(dto) {
    const {
      title,
      description,
      maxStudents,
      duration,
      isEnrollable,
      instructorId,
    } = dto;
    if (!title) throw new common_1.BadRequestException('title is required');
    return this.prisma.course.create({
      data: {
        title,
        description: description ?? '',
        maxStudents: maxStudents ? parseInt(maxStudents, 10) : null,
        duration: duration ?? null,
        isEnrollable: isEnrollable !== undefined ? Boolean(isEnrollable) : true,
        isActive: true,
        instructorId: instructorId ? parseInt(instructorId, 10) : null,
      },
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
        _count: { select: { enrollments: true } },
      },
    });
  }
  async update(id, dto) {
    const data = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.maxStudents !== undefined)
      data.maxStudents = dto.maxStudents ? parseInt(dto.maxStudents, 10) : null;
    if (dto.duration !== undefined) data.duration = dto.duration;
    if (dto.isActive !== undefined) data.isActive = Boolean(dto.isActive);
    if (dto.isEnrollable !== undefined)
      data.isEnrollable = Boolean(dto.isEnrollable);
    if (dto.instructorId !== undefined)
      data.instructorId = dto.instructorId
        ? parseInt(dto.instructorId, 10)
        : null;
    return this.prisma.course.update({
      where: { id },
      data,
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
        _count: { select: { enrollments: true } },
      },
    });
  }
  async getInstructors() {
    const instructors = await this.prisma.instructor.findMany({
      include: { contact: { include: { person: true } } },
      orderBy: { id: 'asc' },
    });
    return instructors.map((i) => ({
      id: i.id,
      contactId: i.contactId,
      name: [i.contact?.person?.firstName, i.contact?.person?.lastName]
        .filter(Boolean)
        .join(' '),
    }));
  }
  async updateInstructor(courseId, instructorId) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { instructorId },
    });
  }
  async findAll() {
    return this.prisma.course.findMany({
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async findAllForClient(_hub, isActive, instructorContactId) {
    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (instructorContactId) {
      const instructor = await this.prisma.instructor.findFirst({
        where: { contactId: instructorContactId },
        select: { id: true },
      });
      if (instructor) {
        where.instructorId = instructor.id;
      } else {
        return [];
      }
    }
    const courses = await this.prisma.course.findMany({
      where,
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return courses.map((c) => ({
      id: c.id,
      name: c.title,
      title: c.title,
      description: c.description,
      duration: c.duration,
      capacity: c.maxStudents || null,
      enrolledCount: c._count?.enrollments || 0,
      isActive: c.isActive,
      isEnrollable: c.isEnrollable,
      instructorId: c.instructorId,
      instructor: c.instructor
        ? `${c.instructor.contact?.person?.firstName} ${c.instructor.contact?.person?.lastName}`
        : null,
      instructorSpecialization: c.instructor?.specialization ?? null,
    }));
  }
  async getCombo() {
    const courses = await this.prisma.course.findMany({
      select: { id: true, title: true },
      where: { isActive: true },
      orderBy: { title: 'asc' },
    });
    return courses.map((c) => ({ id: c.id.toString(), name: c.title }));
  }
  async resolveStudentId(input) {
    if (input && typeof input === 'object') {
      const contactId = input.contactId ?? input.contact?.id;
      if (!contactId) return null;
      const student = await this.prisma.student.findFirst({
        where: { contactId: Number(contactId) },
        select: { id: true },
      });
      return student?.id ?? null;
    }
    const parsed = parseInt(String(input), 10);
    if (isNaN(parsed)) return null;
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
    return student?.id ?? null;
  }
  async getEnrollments(contactId, groupId) {
    const where = {};
    if (groupId) {
      where.courseId = parseInt(groupId, 10);
    }
    if (contactId) {
      const studentId = await this.resolveStudentId(contactId);
      if (!studentId) return [];
      where.studentId = studentId;
    }
    where.status = { not: 'Dropped' };
    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: {
        course: { include: { hub: true } },
        student: {
          include: {
            contact: {
              include: {
                person: true,
                email: true,
                phone: true,
              },
            },
            submissions: {
              where: {
                assignment: { courseId: where.courseId ?? undefined },
                status: { in: ['Graded', 'Returned'] },
                score: { not: null },
              },
              include: { assignment: { select: { maxScore: true } } },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    return enrollments.map((e) => {
      const person = e.student?.contact?.person;
      const emails = e.student?.contact?.email ?? [];
      const phones = e.student?.contact?.phone ?? [];
      const gradedSubs = e.student?.submissions ?? [];
      const avgGrade =
        gradedSubs.length > 0
          ? Math.round(
              gradedSubs.reduce((sum, s) => {
                const max = s.assignment?.maxScore ?? 100;
                return sum + (max > 0 ? (s.score / max) * 100 : 0);
              }, 0) / gradedSubs.length,
            )
          : null;
      return {
        id: e.id.toString(),
        courseId: e.courseId.toString(),
        course: {
          id: e.courseId.toString(),
          name: e.course?.title || '',
          title: e.course?.title || '',
        },
        courseName: e.course?.title || '',
        hubName: e.course?.hub?.name || '',
        status: e.status.toLowerCase(),
        progress: e.progress,
        avgGrade,
        submissionCount: gradedSubs.length,
        enrolledAt: e.enrolledAt,
        contactId: e.student?.contactId?.toString() ?? null,
        studentId: e.studentId.toString(),
        firstName: person?.firstName ?? '',
        lastName: person?.lastName ?? '',
        email: emails[0]?.value ?? '',
        phone: phones[0]?.value ?? '',
        student: e.student
          ? {
              id: e.student.id,
              contactId: e.student.contactId,
              contact: {
                person: person ?? null,
                email: emails[0]?.value ?? null,
                phone: phones[0]?.value ?? null,
              },
            }
          : null,
      };
    });
  }
  async enrollStudent(body) {
    let studentDbId;
    const courseDbId = parseInt(body.courseId ?? body.groupId ?? '0', 10);
    if (body.studentId) {
      studentDbId = parseInt(body.studentId, 10);
    } else if (body.contactId) {
      const student = await this.prisma.student.findFirst({
        where: { contactId: parseInt(body.contactId, 10) },
        select: { id: true },
      });
      if (!student)
        throw new common_1.BadRequestException(
          'Student not found for contactId ' + body.contactId,
        );
      studentDbId = student.id;
    } else {
      throw new common_1.BadRequestException(
        'Either studentId or contactId is required',
      );
    }
    const course = await this.prisma.course.findUnique({
      where: { id: courseDbId },
    });
    if (!course) throw new common_1.NotFoundException('Course not found');
    const existing = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: studentDbId, courseId: courseDbId },
      },
    });
    if (existing) {
      if (existing.status === 'Dropped') {
        return this.prisma.enrollment.update({
          where: { id: existing.id },
          data: { status: 'Enrolled' },
        });
      }
      return existing;
    }
    return this.prisma.enrollment.create({
      data: {
        studentId: studentDbId,
        courseId: courseDbId,
        status: 'Enrolled',
        progress: 0,
      },
    });
  }
  async adminEnrollStudent(courseId, body) {
    let studentDbId;
    if (body.studentId) {
      studentDbId = parseInt(body.studentId, 10);
    } else if (body.contactId) {
      const student = await this.prisma.student.findFirst({
        where: { contactId: parseInt(body.contactId, 10) },
        select: { id: true },
      });
      if (!student)
        throw new common_1.BadRequestException(
          'Student not found for contactId ' + body.contactId,
        );
      studentDbId = student.id;
    } else {
      throw new common_1.BadRequestException(
        'studentId or contactId is required',
      );
    }
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new common_1.NotFoundException('Course not found');
    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: studentDbId, courseId } },
    });
    if (existing) {
      if (existing.status === 'Dropped') {
        return this.prisma.enrollment.update({
          where: { id: existing.id },
          data: { status: 'Enrolled' },
        });
      }
      return existing;
    }
    return this.prisma.enrollment.create({
      data: {
        studentId: studentDbId,
        courseId,
        status: 'Enrolled',
        progress: 0,
      },
    });
  }
  async getPendingEnrollments() {
    const pending = await this.prisma.enrollment.findMany({
      where: { status: 'Pending' },
      include: {
        student: { include: { contact: { include: { person: true } } } },
        course: true,
      },
      orderBy: { enrolledAt: 'asc' },
    });
    return pending.map((e) => ({
      id: e.id,
      studentId: e.studentId,
      courseId: e.courseId,
      studentName:
        [
          e.student?.contact?.person?.firstName,
          e.student?.contact?.person?.lastName,
        ]
          .filter(Boolean)
          .join(' ') || 'Unknown',
      courseName: e.course?.title || 'Unknown',
      requestedAt: e.enrolledAt,
    }));
  }
  async approveEnrollment(enrollmentId) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enrollment)
      throw new common_1.NotFoundException('Enrollment not found');
    if (enrollment.status !== 'Pending')
      throw new common_1.BadRequestException('Enrollment is not pending');
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'Enrolled' },
    });
  }
  async rejectEnrollment(enrollmentId) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enrollment)
      throw new common_1.NotFoundException('Enrollment not found');
    if (enrollment.status !== 'Pending')
      throw new common_1.BadRequestException('Enrollment is not pending');
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'Dropped' },
    });
  }
  async getCourseReports() {
    const courses = await this.prisma.course.findMany({
      include: { hub: true, _count: { select: { enrollments: true } } },
    });
    return courses.map((c) => ({
      id: c.id.toString(),
      name: c.title,
      hub: c.hub?.name || '',
      enrolledCount: c._count?.enrollments || 0,
      isActive: c.isActive,
      isEnrollable: c.isEnrollable,
    }));
  }
  async findOne(id) {
    const c = await this.prisma.course.findUnique({
      where: { id },
      include: {
        hub: true,
        instructor: { include: { contact: { include: { person: true } } } },
        enrollments: {
          include: {
            student: { include: { contact: { include: { person: true } } } },
          },
        },
        study_resources: true,
        assignments: true,
        modules: {
          include: { contents: true },
          orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }],
        },
      },
    });
    if (!c) return null;
    return { ...c, name: c.title, enrolledCount: c.enrollments.length };
  }
  async getStudentCourses(studentId) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            hub: true,
            modules: { include: { contents: { select: { id: true } } } },
          },
        },
      },
    });
    return enrollments.map((e) => {
      const totalLessons = e.course.modules.reduce(
        (sum, m) => sum + m.contents.length,
        0,
      );
      return {
        enrollmentId: e.id,
        courseId: e.courseId,
        title: e.course.title,
        description: e.course.description,
        hub: e.course.hub?.name ?? '',
        progress: e.progress,
        status: e.status,
        enrolledAt: e.enrolledAt,
        totalModules: e.course.modules.length,
        totalLessons,
      };
    });
  }
  async getCourseModules(courseId, studentId) {
    const modules = await this.prisma.course_module.findMany({
      where: { courseId, isPublished: true },
      include: {
        contents: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: studentId
            ? { progress: { where: { studentId } } }
            : undefined,
        },
      },
      orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }],
    });
    return modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      weekNumber: m.weekNumber,
      order: m.order,
      contentCount: m.contents.length,
      completedCount: studentId
        ? m.contents.filter((c) => c.progress?.length > 0).length
        : undefined,
      contents: m.contents.map((c) => ({
        id: c.id,
        title: c.title,
        type: c.type,
        order: c.order,
        durationMin: c.durationMin,
        completed: studentId ? (c.progress?.length ?? 0) > 0 : undefined,
      })),
    }));
  }
  async getModule(moduleId, studentId) {
    const m = await this.prisma.course_module.findUnique({
      where: { id: moduleId },
      include: {
        course: true,
        contents: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: studentId
            ? { progress: { where: { studentId } } }
            : undefined,
        },
      },
    });
    if (!m) return null;
    return {
      id: m.id,
      courseId: m.courseId,
      courseTitle: m.course.title,
      title: m.title,
      description: m.description,
      weekNumber: m.weekNumber,
      contents: m.contents.map((c) => ({
        id: c.id,
        title: c.title,
        body: c.body,
        videoUrl: c.videoUrl,
        type: c.type,
        order: c.order,
        durationMin: c.durationMin,
        completed: studentId ? (c.progress?.length ?? 0) > 0 : undefined,
      })),
    };
  }
  async getContent(contentId, studentId) {
    const c = await this.prisma.module_content.findUnique({
      where: { id: contentId },
      include: {
        module: { include: { course: true } },
        progress: studentId ? { where: { studentId } } : false,
      },
    });
    if (!c) return null;
    return {
      id: c.id,
      moduleId: c.moduleId,
      weekNumber: c.module.weekNumber,
      courseId: c.module.courseId,
      courseTitle: c.module.course.title,
      title: c.title,
      body: c.body,
      videoUrl: c.videoUrl,
      type: c.type,
      durationMin: c.durationMin,
      completed: studentId ? (c.progress?.length ?? 0) > 0 : undefined,
    };
  }
  async markContentComplete(contentId, studentId) {
    const existing = await this.prisma.content_progress.findUnique({
      where: { studentId_contentId: { studentId, contentId } },
    });
    if (existing) return { alreadyCompleted: true };
    await this.prisma.content_progress.create({
      data: { studentId, contentId },
    });
    const content = await this.prisma.module_content.findUnique({
      where: { id: contentId },
      include: { module: true },
    });
    if (content) {
      const courseId = content.module.courseId;
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId, courseId } },
      });
      if (enrollment) {
        const totalContents = await this.prisma.module_content.count({
          where: { module: { courseId }, isPublished: true },
        });
        const completedContents = await this.prisma.content_progress.count({
          where: { studentId, content: { module: { courseId } } },
        });
        const newProgress =
          totalContents > 0
            ? Math.round((completedContents / totalContents) * 100)
            : 0;
        await this.prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            progress: newProgress,
            status: newProgress >= 100 ? 'Completed' : 'InProgress',
          },
        });
      }
    }
    return { completed: true };
  }
  async getCourseProgress(courseId, studentId) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    const completedItems = await this.prisma.content_progress.findMany({
      where: { studentId, content: { module: { courseId } } },
      select: { contentId: true },
    });
    return {
      courseId,
      studentId,
      progress: enrollment?.progress ?? 0,
      status: enrollment?.status ?? 'Enrolled',
      completedContentIds: completedItems.map((p) => p.contentId),
    };
  }
  async createModule(courseId, dto) {
    return this.prisma.course_module.create({
      data: {
        courseId,
        title: dto.title,
        description: dto.description,
        weekNumber: dto.weekNumber ?? 1,
        order: dto.order ?? 0,
        isPublished: dto.isPublished ?? true,
      },
    });
  }
  async updateModule(moduleId, dto) {
    return this.prisma.course_module.update({
      where: { id: moduleId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.weekNumber !== undefined && { weekNumber: dto.weekNumber }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });
  }
  async reorderModules(courseId, moduleIds) {
    const existing = await this.prisma.course_module.findMany({
      where: { courseId },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((m) => m.id));
    if (
      !Array.isArray(moduleIds) ||
      moduleIds.length !== existing.length ||
      !moduleIds.every((id) => existingIds.has(id))
    ) {
      throw new common_1.BadRequestException(
        "moduleIds must include exactly the course's current modules",
      );
    }
    await this.prisma.$transaction(
      moduleIds.map((id, index) =>
        this.prisma.course_module.update({
          where: { id },
          data: { order: index, weekNumber: index + 1 },
        }),
      ),
    );
    return this.getCourseModules(courseId);
  }
  async createContent(moduleId, dto) {
    return this.prisma.module_content.create({
      data: {
        moduleId,
        title: dto.title,
        body: dto.body,
        videoUrl: dto.videoUrl,
        type: dto.type ?? 'Lesson',
        order: dto.order ?? 0,
        durationMin: dto.durationMin,
        isPublished: dto.isPublished ?? true,
      },
    });
  }
  async updateContent(contentId, dto) {
    return this.prisma.module_content.update({
      where: { id: contentId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.body !== undefined && { body: dto.body }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.durationMin !== undefined && { durationMin: dto.durationMin }),
      },
    });
  }
  async deleteContent(contentId) {
    await this.prisma.content_progress.deleteMany({ where: { contentId } });
    return this.prisma.module_content.delete({ where: { id: contentId } });
  }
  async findByHub(hubId) {
    return this.prisma.course.findMany({
      where: { hubId },
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
      },
    });
  }
  async getCourseResources(courseId) {
    return this.prisma.study_resource.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async addCourseResource(courseId, dto) {
    return this.prisma.study_resource.create({
      data: {
        courseId,
        title: dto.title,
        description: dto.description ?? null,
        type: dto.type ?? 'Document',
        url: dto.url ?? null,
        filePath: dto.filePath ?? null,
        isPublic: true,
      },
    });
  }
  async removeCourseResource(courseId, resourceId) {
    await this.prisma.study_resource.deleteMany({
      where: { id: resourceId, courseId },
    });
    return { success: true };
  }
  async getCourseTrainerStats(courseId) {
    const now = new Date();
    const todayDow = now.getDay();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const [
      activeStudents,
      classesToday,
      todayAttendance,
      submissions,
      enrollments,
      assignedCount,
    ] = await Promise.all([
      this.prisma.enrollment.count({
        where: { courseId, status: { in: ['Enrolled', 'InProgress'] } },
      }),
      this.prisma.timetable_session.count({
        where: { courseId, dayOfWeek: todayDow },
      }),
      this.prisma.attendance_record
        .findMany({
          where: {
            session: { courseId },
            checkedInAt: { gte: startOfToday, lt: startOfTomorrow },
            method: { not: 'Absent' },
          },
          select: { studentId: true },
          distinct: ['studentId'],
        })
        .then((r) => r.length),
      this.prisma.submission.findMany({
        where: { assignment: { courseId }, status: 'Submitted' },
        select: { id: true },
      }),
      this.prisma.submission.findMany({
        where: {
          assignment: { courseId },
          status: { in: ['Graded', 'Returned'] },
          score: { not: null },
        },
        include: {
          assignment: { select: { maxScore: true } },
          student: { include: { contact: { include: { person: true } } } },
        },
      }),
      this.prisma.assignment.count({ where: { courseId, isActive: true } }),
    ]);
    const gradeMap = new Map();
    for (const sub of enrollments) {
      const sid = sub.studentId;
      const maxScore = sub.assignment?.maxScore ?? 100;
      const pct = maxScore > 0 ? (sub.score / maxScore) * 100 : 0;
      if (!gradeMap.has(sid)) {
        const p = sub.student?.contact?.person;
        gradeMap.set(sid, {
          name:
            [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'Unknown',
          totalScore: 0,
          submissionCount: 0,
        });
      }
      const entry = gradeMap.get(sid);
      entry.totalScore += pct;
      entry.submissionCount += 1;
    }
    const topStudents = Array.from(gradeMap.values())
      .map(({ name, totalScore, submissionCount }) => {
        const divisor = Math.max(assignedCount, submissionCount, 1);
        return {
          name,
          avgGrade: Math.round(totalScore / divisor),
        };
      })
      .sort((a, b) => b.avgGrade - a.avgGrade)
      .slice(0, 5);
    return {
      activeStudents,
      classesToday,
      todayAttendance,
      pendingSubmissions: submissions.length,
      topStudents,
    };
  }
  async getTrainerStats(contactId) {
    const instructor = await this.prisma.instructor.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!instructor)
      return {
        courses: 0,
        activeStudents: 0,
        classesToday: 0,
        todayAttendance: 0,
        pendingSubmissions: 0,
        liveSessions: [],
      };
    const courses = await this.prisma.course.findMany({
      where: { instructorId: instructor.id },
      select: { id: true },
    });
    const courseIds = courses.map((c) => c.id);
    const now = new Date();
    const todayDow = now.getDay();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
    const [
      activeStudents,
      totalEnrolled,
      classesToday,
      todayAttendance,
      pendingSubmissions,
      timetableSessions,
    ] = await Promise.all([
      this.prisma.enrollment.count({
        where: {
          courseId: { in: courseIds },
          status: { in: ['Enrolled', 'InProgress'] },
        },
      }),
      this.prisma.enrollment.count({
        where: {
          courseId: { in: courseIds },
          status: { not: 'Dropped' },
        },
      }),
      this.prisma.timetable_session.count({
        where: { courseId: { in: courseIds }, dayOfWeek: todayDow },
      }),
      this.prisma.attendance_record
        .findMany({
          where: {
            session: { courseId: { in: courseIds } },
            checkedInAt: { gte: startOfToday, lt: startOfTomorrow },
            method: { not: 'Absent' },
          },
          select: { studentId: true },
          distinct: ['studentId'],
        })
        .then((r) => r.length),
      this.prisma.submission.count({
        where: {
          assignment: { courseId: { in: courseIds } },
          status: 'Submitted',
        },
      }),
      this.prisma.timetable_session.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          course: { select: { id: true, title: true } },
          hub: { select: { id: true, name: true } },
        },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      }),
    ]);
    const liveSessions = timetableSessions
      .filter((s) => {
        if (s.dayOfWeek !== todayDow) return false;
        const [sh, sm] = s.startTime.split(':').map(Number);
        const [eh, em] = s.endTime.split(':').map(Number);
        const cur = now.getHours() * 60 + now.getMinutes();
        return cur >= sh * 60 + sm && cur <= eh * 60 + em;
      })
      .map((s) => ({
        id: s.id,
        courseId: s.courseId,
        courseName: s.course?.title ?? null,
        hubName: s.hub?.name ?? null,
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room ?? null,
        isLive: true,
      }));
    const gradedSubs = await this.prisma.submission.findMany({
      where: {
        assignment: { courseId: { in: courseIds } },
        status: { in: ['Graded', 'Returned'] },
        score: { not: null },
      },
      include: {
        assignment: {
          select: {
            maxScore: true,
            courseId: true,
            course: { select: { title: true } },
          },
        },
        student: { include: { contact: { include: { person: true } } } },
      },
    });
    const tpMap = new Map();
    for (const sub of gradedSubs) {
      const sid = sub.studentId;
      const max = sub.assignment?.maxScore ?? 100;
      const pct = max > 0 ? (sub.score / max) * 100 : 0;
      if (!tpMap.has(sid)) {
        const p = sub.student?.contact?.person;
        tpMap.set(sid, {
          name:
            [p?.firstName, p?.lastName].filter(Boolean).join(' ') || 'Unknown',
          courseName: sub.assignment?.course?.title ?? '',
          totalScore: 0,
          submissionCount: 0,
          courseIds: new Set(),
        });
      }
      const entry = tpMap.get(sid);
      entry.totalScore += pct;
      entry.submissionCount += 1;
      if (sub.assignment?.courseId)
        entry.courseIds.add(sub.assignment.courseId);
    }
    const tpCourseIds = new Set();
    tpMap.forEach((v) => v.courseIds.forEach((id) => tpCourseIds.add(id)));
    const tpAssignmentCounts = tpCourseIds.size
      ? await this.prisma.assignment.groupBy({
          by: ['courseId'],
          where: { courseId: { in: [...tpCourseIds] }, isActive: true },
          _count: { _all: true },
        })
      : [];
    const tpAssignmentCountMap = new Map(
      tpAssignmentCounts.map((a) => [a.courseId, a._count._all]),
    );
    const topStudents = Array.from(tpMap.values())
      .map(
        ({
          name,
          courseName,
          totalScore,
          submissionCount,
          courseIds: cids,
        }) => {
          const totalAssigned = [...cids].reduce(
            (sum, cid) => sum + (tpAssignmentCountMap.get(cid) ?? 0),
            0,
          );
          const divisor = Math.max(totalAssigned, submissionCount, 1);
          return {
            name,
            courseName,
            avgGrade: Math.round(totalScore / divisor),
            submissionCount,
          };
        },
      )
      .sort((a, b) => b.avgGrade - a.avgGrade)
      .slice(0, 10);
    return {
      courses: courseIds.length,
      activeStudents,
      inactiveStudents: Math.max(0, totalEnrolled - activeStudents),
      classesToday,
      todayAttendance,
      pendingSubmissions,
      liveSessions,
      topStudents,
    };
  }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  CoursesService,
);
//# sourceMappingURL=courses.service.js.map
