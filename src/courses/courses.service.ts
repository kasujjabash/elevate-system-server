import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // Resolve prisma student.id from JWT user (has contactId)
  async resolveStudentId(jwtUser: any): Promise<number | undefined> {
    if (!jwtUser) return undefined;
    const contactId = jwtUser.contactId ?? jwtUser.contact?.id;
    if (!contactId) return undefined;
    const student = await this.prisma.student.findFirst({
      where: { contactId: Number(contactId) },
      select: { id: true },
    });
    return student?.id;
  }

  // ── Admin: create a course ────────────────────────────────────────────────
  async create(dto: any) {
    const {
      title,
      description,
      maxStudents,
      duration,
      isEnrollable,
      instructorId,
    } = dto;
    if (!title) throw new BadRequestException('title is required');

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

  // ── Admin: update a course ────────────────────────────────────────────────
  async update(id: number, dto: any) {
    const data: any = {};
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

  // ── List instructors for dropdowns ────────────────────────────────────────
  async getInstructors() {
    const instructors = await this.prisma.instructor.findMany({
      include: { contact: { include: { person: true } } },
      orderBy: { id: 'asc' },
    });
    return instructors.map((i) => ({
      id: i.id,
      name: [i.contact?.person?.firstName, i.contact?.person?.lastName]
        .filter(Boolean)
        .join(' '),
    }));
  }

  // ── Admin: toggle isEnrollable ────────────────────────────────────────────
  async toggleEnrollable(id: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    return this.prisma.course.update({
      where: { id },
      data: { isEnrollable: !course.isEnrollable },
      select: { id: true, title: true, isEnrollable: true },
    });
  }

  // ── List all courses ──────────────────────────────────────────────────────
  async findAll() {
    return this.prisma.course.findMany({
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── List courses for client/student ──────────────────────────────────────
  async findAllForClient(_hub?: string, isActive?: string) {
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

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

  // ── Combo for dropdowns ───────────────────────────────────────────────────
  async getCombo() {
    const courses = await this.prisma.course.findMany({
      select: { id: true, title: true },
      where: { isActive: true },
      orderBy: { title: 'asc' },
    });
    return courses.map((c) => ({ id: c.id.toString(), name: c.title }));
  }

  // ── Enrollments list ──────────────────────────────────────────────────────
  async getEnrollments(contactId?: string) {
    const where: any = {};
    if (contactId) {
      const student = await this.prisma.student.findFirst({
        where: { contactId: parseInt(contactId, 10) },
        select: { id: true },
      });
      if (!student) return [];
      where.studentId = student.id;
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where,
      include: { course: { include: { hub: true } } },
    });

    return enrollments.map((e) => ({
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
      enrolledAt: e.enrolledAt,
    }));
  }

  // ── Enroll a student ──────────────────────────────────────────────────────
  async enrollStudent(body: {
    studentId?: string;
    courseId?: string;
    groupId?: string;
    contactId?: string;
    hubId?: string;
  }) {
    let studentDbId: number;
    const courseDbId = parseInt(body.courseId ?? body.groupId ?? '0', 10);

    if (body.studentId) {
      studentDbId = parseInt(body.studentId, 10);
    } else if (body.contactId) {
      const student = await this.prisma.student.findFirst({
        where: { contactId: parseInt(body.contactId, 10) },
        select: { id: true },
      });
      if (!student)
        throw new BadRequestException(
          'Student not found for contactId ' + body.contactId,
        );
      studentDbId = student.id;
    } else {
      throw new BadRequestException(
        'Either studentId or contactId is required',
      );
    }

    // Check course is enrollable
    const course = await this.prisma.course.findUnique({
      where: { id: courseDbId },
    });
    if (!course) throw new NotFoundException('Course not found');
    if (!course.isEnrollable)
      throw new BadRequestException('This course is not open for enrollment');

    const existing = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: studentDbId, courseId: courseDbId },
      },
    });
    if (existing) return existing;

    return this.prisma.enrollment.create({
      data: {
        studentId: studentDbId,
        courseId: courseDbId,
        status: 'Enrolled',
        progress: 0,
      },
    });
  }

  // ── Student self-enroll (from JWT) ────────────────────────────────────────
  async selfEnroll(jwtUser: any, courseId: number) {
    const studentId = await this.resolveStudentId(jwtUser);
    if (!studentId)
      throw new BadRequestException(
        'No student profile found for this account',
      );

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');
    if (!course.isEnrollable)
      throw new BadRequestException('This course is not open for enrollment');

    // Already enrolled or pending in this course?
    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) return { status: existing.status, enrollment: existing };

    // Check for any active enrollment in another course
    const activeEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId,
        status: { in: ['Enrolled', 'InProgress'] },
        courseId: { not: courseId },
      },
    });

    // If already in another course → create a pending request instead
    const enrollmentStatus = activeEnrollment ? 'Pending' : 'Enrolled';

    const enrollment = await this.prisma.enrollment.create({
      data: { studentId, courseId, status: enrollmentStatus, progress: 0 },
    });
    return { status: enrollmentStatus, enrollment };
  }

  // ── Admin: list pending enrollment requests ───────────────────────────────
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

  // ── Admin: approve a pending enrollment ───────────────────────────────────
  async approveEnrollment(enrollmentId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.status !== 'Pending')
      throw new BadRequestException('Enrollment is not pending');
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'Enrolled' },
    });
  }

  // ── Admin: reject a pending enrollment ────────────────────────────────────
  async rejectEnrollment(enrollmentId: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.status !== 'Pending')
      throw new BadRequestException('Enrollment is not pending');
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'Dropped' },
    });
  }

  // ── Course reports ────────────────────────────────────────────────────────
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

  // ── Single course ─────────────────────────────────────────────────────────
  async findOne(id: number) {
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

  // ── Student: enrolled courses with progress ────────────────────────────────
  async getStudentCourses(studentId: number) {
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

  // ── Modules: list for a course ────────────────────────────────────────────
  async getCourseModules(courseId: number, studentId?: number) {
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
        ? m.contents.filter((c: any) => c.progress?.length > 0).length
        : undefined,
      contents: m.contents.map((c: any) => ({
        id: c.id,
        title: c.title,
        type: c.type,
        order: c.order,
        durationMin: c.durationMin,
        completed: studentId ? (c.progress?.length ?? 0) > 0 : undefined,
      })),
    }));
  }

  // ── Single module ─────────────────────────────────────────────────────────
  async getModule(moduleId: number, studentId?: number) {
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
      courseTitle: (m as any).course.title,
      title: m.title,
      description: m.description,
      weekNumber: m.weekNumber,
      contents: m.contents.map((c: any) => ({
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

  // ── Single content item ───────────────────────────────────────────────────
  async getContent(contentId: number, studentId?: number) {
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
      weekNumber: (c as any).module.weekNumber,
      courseId: (c as any).module.courseId,
      courseTitle: (c as any).module.course.title,
      title: c.title,
      body: c.body,
      videoUrl: c.videoUrl,
      type: c.type,
      durationMin: c.durationMin,
      completed: studentId ? ((c as any).progress?.length ?? 0) > 0 : undefined,
    };
  }

  // ── Mark content complete ─────────────────────────────────────────────────
  async markContentComplete(contentId: number, studentId: number) {
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
      const courseId = (content as any).module.courseId;
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

  // ── Course progress for a student ─────────────────────────────────────────
  async getCourseProgress(courseId: number, studentId: number) {
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

  // ── Admin: create a module ────────────────────────────────────────────────
  async createModule(courseId: number, dto: any) {
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

  // ── Admin: add content to a module ───────────────────────────────────────
  async createContent(moduleId: number, dto: any) {
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

  async findByHub(hubId: number) {
    return this.prisma.course.findMany({
      where: { hubId },
      include: {
        instructor: { include: { contact: { include: { person: true } } } },
      },
    });
  }
}
