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
exports.ModulesService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let ModulesService = class ModulesService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async getModulesByCourse(courseId) {
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
  async getModule(moduleId) {
    const m = await this.prisma.course_module.findUnique({
      where: { id: moduleId },
      include: {
        contents: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!m) throw new common_1.NotFoundException('Module not found');
    return m;
  }
  async getContent(contentId) {
    const content = await this.prisma.module_content.findUnique({
      where: { id: contentId },
      include: {
        module: { select: { id: true, title: true, courseId: true } },
      },
    });
    if (!content) throw new common_1.NotFoundException('Content not found');
    return content;
  }
  async markComplete(studentId, contentId) {
    const content = await this.prisma.module_content.findUnique({
      where: { id: contentId },
      include: { module: { select: { courseId: true } } },
    });
    if (!content) throw new common_1.NotFoundException('Content not found');
    const progress = await this.prisma.content_progress.upsert({
      where: { studentId_contentId: { studentId, contentId } },
      create: { studentId, contentId },
      update: { completedAt: new Date() },
    });
    await this.recalcCourseProgress(studentId, content.module.courseId);
    return { contentId, completed: true, completedAt: progress.completedAt };
  }
  async getCourseProgress(studentId, courseId) {
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
  async createModule(data) {
    return this.prisma.course_module.create({ data });
  }
  async createContent(data) {
    return this.prisma.module_content.create({ data });
  }
  async recalcCourseProgress(studentId, courseId) {
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
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  ModulesService,
);
//# sourceMappingURL=modules.service.js.map
