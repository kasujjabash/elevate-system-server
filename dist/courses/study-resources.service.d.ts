import { PrismaService } from '../shared/prisma.service';
export declare class StudyResourcesService {
  private prisma;
  constructor(prisma: PrismaService);
  create(createStudyResourceDto: any): Promise<{
    isPublic: boolean;
    id: number;
    type: import('.prisma/client').$Enums.study_resource_type_enum;
    title: string;
    url: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    filePath: string;
  }>;
  findByCourse(courseId: number): Promise<
    ({
      course: {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        isEnrollable: boolean;
        maxStudents: number;
        instructorId: number;
        skillCategoryId: string;
      };
    } & {
      isPublic: boolean;
      id: number;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      title: string;
      url: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
    })[]
  >;
  findPublicResources(): Promise<
    ({
      course: {
        hub: {
          address: string;
          id: number;
          name: string;
          description: string;
          isActive: boolean;
          location: string;
          createdAt: Date;
          updatedAt: Date;
          code: string;
          managerName: string;
          managerPhone: string;
          managerEmail: string;
          computers: number;
          projectors: number;
          capacity: number;
          notes: string;
        };
        skillCategory: {
          id: string;
          name: string;
          description: string;
        };
      } & {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        isEnrollable: boolean;
        maxStudents: number;
        instructorId: number;
        skillCategoryId: string;
      };
    } & {
      isPublic: boolean;
      id: number;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      title: string;
      url: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
    })[]
  >;
  findOne(id: number): Promise<
    {
      course: {
        id: number;
        title: string;
        description: string;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        duration: string;
        isEnrollable: boolean;
        maxStudents: number;
        instructorId: number;
        skillCategoryId: string;
      };
    } & {
      isPublic: boolean;
      id: number;
      type: import('.prisma/client').$Enums.study_resource_type_enum;
      title: string;
      url: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
      filePath: string;
    }
  >;
}
