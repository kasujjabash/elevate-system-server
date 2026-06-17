import { PrismaService } from '../shared/prisma.service';
export declare class SkillCategoriesService {
  private prisma;
  constructor(prisma: PrismaService);
  create(createSkillCategoryDto: any): Promise<{
    id: string;
    name: string;
    description: string;
  }>;
  findAll(): Promise<
    ({
      courses: {
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
      }[];
    } & {
      id: string;
      name: string;
      description: string;
    })[]
  >;
  findOne(id: string): Promise<
    {
      courses: ({
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
        instructor: {
          contact: {
            person: {
              id: number;
              firstName: string;
              lastName: string;
              middleName: string;
              gender: import('.prisma/client').$Enums.person_gender_enum;
              avatar: string;
              dateOfBirth: Date;
              contactId: number;
            };
          } & {
            id: number;
            category: 'Person';
          };
        } & {
          id: number;
          contactId: number;
          isActive: boolean;
          hubId: number;
          employeeId: string;
          specialization: string;
          createdAt: Date;
          updatedAt: Date;
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
      })[];
    } & {
      id: string;
      name: string;
      description: string;
    }
  >;
}
