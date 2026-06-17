import { PrismaService } from '../shared/prisma.service';
export declare class ModulesService {
  private prisma;
  constructor(prisma: PrismaService);
  getModulesByCourse(courseId: number): Promise<
    {
      id: number;
      title: string;
      description: string;
      weekNumber: number;
      order: number;
      contentCount: number;
      contents: {
        id: number;
        type: import('.prisma/client').$Enums.module_content_type_enum;
        title: string;
        order: number;
        videoUrl: string;
        durationMin: number;
      }[];
    }[]
  >;
  getModule(moduleId: number): Promise<
    {
      contents: {
        id: number;
        type: import('.prisma/client').$Enums.module_content_type_enum;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        isPublished: boolean;
        body: string;
        videoUrl: string;
        durationMin: number;
        moduleId: number;
      }[];
    } & {
      id: number;
      title: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      weekNumber: number;
      order: number;
      isPublished: boolean;
    }
  >;
  getContent(contentId: number): Promise<
    {
      module: {
        id: number;
        title: string;
        courseId: number;
      };
    } & {
      id: number;
      type: import('.prisma/client').$Enums.module_content_type_enum;
      title: string;
      createdAt: Date;
      updatedAt: Date;
      order: number;
      isPublished: boolean;
      body: string;
      videoUrl: string;
      durationMin: number;
      moduleId: number;
    }
  >;
  markComplete(
    studentId: number,
    contentId: number,
  ): Promise<{
    contentId: number;
    completed: boolean;
    completedAt: Date;
  }>;
  getCourseProgress(
    studentId: number,
    courseId: number,
  ): Promise<{
    courseId: number;
    totalContent: number;
    completed: number;
    percent: number;
  }>;
  createModule(data: {
    courseId: number;
    title: string;
    description?: string;
    weekNumber?: number;
    order?: number;
  }): Promise<{
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    weekNumber: number;
    order: number;
    isPublished: boolean;
  }>;
  createContent(data: {
    moduleId: number;
    title: string;
    body?: string;
    videoUrl?: string;
    type?: any;
    order?: number;
    durationMin?: number;
  }): Promise<{
    id: number;
    type: import('.prisma/client').$Enums.module_content_type_enum;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    order: number;
    isPublished: boolean;
    body: string;
    videoUrl: string;
    durationMin: number;
    moduleId: number;
  }>;
  private recalcCourseProgress;
}
