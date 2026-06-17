import { PrismaService } from '../shared/prisma.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
export declare class WorkshopsService {
  private prisma;
  constructor(prisma: PrismaService);
  create(dto: CreateWorkshopDto): Promise<
    {
      hub: {
        name: string;
      };
      course: {
        title: string;
      };
    } & {
      id: number;
      type: import('.prisma/client').$Enums.workshop_type_enum;
      title: string;
      url: string;
      description: string;
      isActive: boolean;
      hubId: number;
      createdAt: Date;
      updatedAt: Date;
      courseId: number;
    }
  >;
  findAll(isActive?: string): Promise<
    {
      id: number;
      title: string;
      description: string;
      type: import('.prisma/client').$Enums.workshop_type_enum;
      url: string;
      courseName: string;
      hubName: string;
      createdAt: Date;
    }[]
  >;
  findOne(id: number): Promise<{
    id: number;
    title: string;
    description: string;
    type: import('.prisma/client').$Enums.workshop_type_enum;
    url: string;
    courseName: string;
    hubName: string;
    createdAt: Date;
  }>;
  update(
    id: number,
    dto: UpdateWorkshopDto,
  ): Promise<{
    id: number;
    title: string;
    description: string;
    type: import('.prisma/client').$Enums.workshop_type_enum;
    url: string;
    courseName: string;
    hubName: string;
    createdAt: Date;
  }>;
  remove(id: number): Promise<{
    id: number;
    type: import('.prisma/client').$Enums.workshop_type_enum;
    title: string;
    url: string;
    description: string;
    isActive: boolean;
    hubId: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
  }>;
}
