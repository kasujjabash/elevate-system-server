import { PrismaService } from '../shared/prisma.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
export declare class HubsService {
  private prisma;
  constructor(prisma: PrismaService);
  create(createHubDto: CreateHubDto): Promise<{
    address: string;
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    location: string;
    code: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    computers: number;
    projectors: number;
    capacity: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
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
      students: {
        id: number;
        contactId: number;
        status: import('.prisma/client').$Enums.student_status_enum;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        enrolledAt: Date;
      }[];
      instructors: {
        id: number;
        contactId: number;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        specialization: string;
      }[];
    } & {
      address: string;
      id: number;
      name: string;
      description: string;
      isActive: boolean;
      location: string;
      code: string;
      managerName: string;
      managerPhone: string;
      managerEmail: string;
      computers: number;
      projectors: number;
      capacity: number;
      notes: string;
      createdAt: Date;
      updatedAt: Date;
    })[]
  >;
  findOne(id: number): Promise<
    {
      courses: ({
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
          createdAt: Date;
          updatedAt: Date;
          employeeId: string;
          specialization: string;
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
      })[];
      students: ({
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
        status: import('.prisma/client').$Enums.student_status_enum;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        enrolledAt: Date;
      })[];
      instructors: ({
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
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        specialization: string;
      })[];
    } & {
      address: string;
      id: number;
      name: string;
      description: string;
      isActive: boolean;
      location: string;
      code: string;
      managerName: string;
      managerPhone: string;
      managerEmail: string;
      computers: number;
      projectors: number;
      capacity: number;
      notes: string;
      createdAt: Date;
      updatedAt: Date;
    }
  >;
  findByCode(code: string): Promise<
    {
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
      students: {
        id: number;
        contactId: number;
        status: import('.prisma/client').$Enums.student_status_enum;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        enrolledAt: Date;
      }[];
      instructors: {
        id: number;
        contactId: number;
        isActive: boolean;
        hubId: number;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        specialization: string;
      }[];
    } & {
      address: string;
      id: number;
      name: string;
      description: string;
      isActive: boolean;
      location: string;
      code: string;
      managerName: string;
      managerPhone: string;
      managerEmail: string;
      computers: number;
      projectors: number;
      capacity: number;
      notes: string;
      createdAt: Date;
      updatedAt: Date;
    }
  >;
  update(
    id: number,
    updateHubDto: UpdateHubDto,
  ): Promise<{
    address: string;
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    location: string;
    code: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    computers: number;
    projectors: number;
    capacity: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  remove(id: number): Promise<{
    address: string;
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    location: string;
    code: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    computers: number;
    projectors: number;
    capacity: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  getHubStatistics(id: number): Promise<{
    statistics: {
      courses: number;
      students: number;
      instructors: number;
    };
    _count: {
      courses: number;
      students: number;
      instructors: number;
    };
    address: string;
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    location: string;
    code: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    computers: number;
    projectors: number;
    capacity: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
