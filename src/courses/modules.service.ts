import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  // List all modules (weeks) for a course
  async getModulesByCourse(courseId: number) {
    const modules = await this.prisma.course_module.findMany({
      where: { courseId, isPublished: true },
      orderBy: { order: 'asc' },
      include: {
        contents: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            order: true,
            durationMin: true,
            videoUrl: true,
          },
        },
      },
    });

    return modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      weekNumber: m.weekNumber,
      order: m.order,
      contentCount: m.contents.length,
      contents: m.contents,
    }));
  }

  // Get a single module with full content
  async getModule(moduleId: number) {
    const m = await this.prisma.course_module.findUnique({
      where: { id: moduleId },
      include: {
        contents: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!m) throw new NotFoundException('Module not found');
    return m;
  }

  // Get a single content item
  async getContent(contentId: number) {
    const content = await this.prisma.module_content.findUnique({
      where: { id: contentId },
      include: {
        module: { select: { id: true, title: true, courseId: true } },
      },
    });

    if (!content) throw new NotFoundException('Content not found');
    return content;
  }

  // Mark a content item as complete for a student
  async markComplete(studentId: number, contentId: number) {
    // Verify content exists
    const content = await this.prisma.module_content.findUnique({
      where: { id: contentId },
      include: { module: { select: { courseId: true } } },
    });
    if (!content) throw new NotFoundException('Content not found');

    // Upsert progress record
    const progress = await this.prisma.content_progress.upsert({
      where: { studentId_contentId: { studentId, contentId } },
      create: { studentId, contentId },
      update: { completedAt: new Date() },
    });

    // Recalculate overall course progress
    await this.recalcCourseProgress(studentId, content.module.courseId);

    return { contentId, completed: true, completedAt: progress.completedAt };
  }

  // Get a student's progress across a course
  async getCourseProgress(studentId: number, courseId: number) {
    const [totalContent, completed] = await Promise.all([
      this.prisma.module_content.count({
        where: {
          isPublished: true,
          module: { courseId, isPublished: true },
        },
      }),
      this.prisma.content_progress.count({
        where: {
          studentId,
          content: {
            isPublished: true,
            module: { courseId, isPublished: true },
          },
        },
      }),
    ]);

    const percent =
      totalContent > 0 ? Math.round((completed / totalContent) * 100) : 0;
    return { courseId, totalContent, completed, percent };
  }

  // Create a module (admin/instructor)
  async createModule(data: {
    courseId: number;
    title: string;
    description?: string;
    weekNumber?: number;
    order?: number;
  }) {
    return this.prisma.course_module.create({ data });
  }

  // Create a content item (admin/instructor)
  async createContent(data: {
    moduleId: number;
    title: string;
    body?: string;
    videoUrl?: string;
    type?: any;
    order?: number;
    durationMin?: number;
  }) {
    return this.prisma.module_content.create({ data });
  }

  private async recalcCourseProgress(studentId: number, courseId: number) {
    const { percent } = await this.getCourseProgress(studentId, courseId);
    await this.prisma.enrollment.updateMany({
      where: { studentId, courseId },
      data: {
        progress: percent,
        status: percent === 100 ? 'Completed' : 'InProgress',
        completedAt: percent === 100 ? new Date() : null,
      },
    });
  }
}
