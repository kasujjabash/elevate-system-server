import { PrismaService } from '../shared/prisma.service';
import { CreateJobPlacementDto } from './dto/create-job-placement.dto';
export declare class JobPlacementsService {
  private prisma;
  constructor(prisma: PrismaService);
  private formatPlacement;
  create(dto: CreateJobPlacementDto, createdBy?: number): Promise<any>;
  update(id: number, dto: CreateJobPlacementDto): Promise<any>;
  findAll(): Promise<any[]>;
  findOne(id: number): Promise<any>;
  remove(id: number): Promise<{
    phone: string;
    id: number;
    gender: string;
    isActive: boolean;
    hubId: number;
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    createdBy: number;
    yearCompleted: number;
    placementType: string;
    jobTitle: string;
    salaryBeforeProgram: number;
    salaryAfterProgram: number;
    companyName: string;
    industry: string;
    employmentType: string;
    referredBy: string;
    internshipOrganization: string;
    internshipRole: string;
    internshipSupervisor: string;
    isPaidInternship: boolean;
    internshipStipend: number;
  }>;
  getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    avgSalaryChangeAmount: number;
    avgSalaryChangePercent: number;
    recordsWithSalaryData: number;
  }>;
}
