import { JobPlacementsService } from './job-placements.service';
import { CreateJobPlacementDto } from './dto/create-job-placement.dto';
export declare class JobPlacementsController {
  private readonly jobPlacementsService;
  constructor(jobPlacementsService: JobPlacementsService);
  findAll(): Promise<any[]>;
  getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    avgSalaryChangeAmount: number;
    avgSalaryChangePercent: number;
    recordsWithSalaryData: number;
  }>;
  findOne(id: number): Promise<any>;
  create(dto: CreateJobPlacementDto, req: any): Promise<any>;
  update(id: number, dto: CreateJobPlacementDto, req: any): Promise<any>;
  remove(
    id: number,
    req: any,
  ): Promise<{
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
}
