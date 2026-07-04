import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateJobPlacementDto } from './dto/create-job-placement.dto';

const INCLUDE = {
  course: { select: { id: true, title: true } },
  hub: { select: { id: true, name: true } },
};

const PLACEMENT_TYPES = ['Employed', 'SelfEmployed', 'Freelance', 'Internship'];

@Injectable()
export class JobPlacementsService {
  constructor(private prisma: PrismaService) {}

  private formatPlacement(placement: any) {
    const { salaryBeforeProgram: before, salaryAfterProgram: after } =
      placement;
    const incomeGrowthPercent =
      before && after ? ((after - before) / before) * 100 : null;
    return { ...placement, incomeGrowthPercent };
  }

  async create(dto: CreateJobPlacementDto, createdBy?: number) {
    const placement = await this.prisma.job_placement.create({
      data: {
        fullName: dto.fullName,
        gender: dto.gender,
        phone: dto.phone,
        courseId: dto.courseId,
        hubId: dto.hubId,
        yearCompleted: dto.yearCompleted,
        placementType: dto.placementType,
        jobTitle: dto.jobTitle,
        salaryBeforeProgram: dto.salaryBeforeProgram,
        salaryAfterProgram: dto.salaryAfterProgram,
        companyName: dto.companyName,
        industry: dto.industry,
        employmentType: dto.employmentType,
        referredBy: dto.referredBy,
        internshipOrganization: dto.internshipOrganization,
        internshipRole: dto.internshipRole,
        internshipSupervisor: dto.internshipSupervisor,
        createdBy: createdBy ?? null,
      },
      include: INCLUDE,
    });
    return this.formatPlacement(placement);
  }

  async update(id: number, dto: CreateJobPlacementDto) {
    const existing = await this.prisma.job_placement.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Placement record not found');

    const placement = await this.prisma.job_placement.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        gender: dto.gender ?? null,
        phone: dto.phone ?? null,
        courseId: dto.courseId,
        hubId: dto.hubId,
        yearCompleted: dto.yearCompleted ?? null,
        placementType: dto.placementType,
        jobTitle: dto.jobTitle ?? null,
        salaryBeforeProgram: dto.salaryBeforeProgram ?? null,
        salaryAfterProgram: dto.salaryAfterProgram ?? null,
        companyName: dto.companyName ?? null,
        industry: dto.industry ?? null,
        employmentType: dto.employmentType ?? null,
        referredBy: dto.referredBy ?? null,
        internshipOrganization: dto.internshipOrganization ?? null,
        internshipRole: dto.internshipRole ?? null,
        internshipSupervisor: dto.internshipSupervisor ?? null,
      },
      include: INCLUDE,
    });
    return this.formatPlacement(placement);
  }

  async findAll() {
    const placements = await this.prisma.job_placement.findMany({
      where: { isActive: true },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return placements.map((p) => this.formatPlacement(p));
  }

  async findOne(id: number) {
    const placement = await this.prisma.job_placement.findUnique({
      where: { id },
      include: INCLUDE,
    });
    if (!placement) throw new NotFoundException('Placement record not found');
    return this.formatPlacement(placement);
  }

  async remove(id: number) {
    const placement = await this.prisma.job_placement.findUnique({
      where: { id },
    });
    if (!placement) throw new NotFoundException('Placement record not found');
    return this.prisma.job_placement.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStats() {
    const placements = await this.prisma.job_placement.findMany({
      where: { isActive: true },
    });

    const total = placements.length;
    const byType = PLACEMENT_TYPES.reduce(
      (acc, type) => {
        acc[type] = placements.filter((p) => p.placementType === type).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const withSalaryData = placements.filter(
      (p) =>
        p.salaryBeforeProgram != null &&
        p.salaryAfterProgram != null &&
        p.salaryBeforeProgram > 0,
    );
    const avgSalaryChangeAmount = withSalaryData.length
      ? withSalaryData.reduce(
          (sum, p) => sum + (p.salaryAfterProgram - p.salaryBeforeProgram),
          0,
        ) / withSalaryData.length
      : null;
    const avgSalaryChangePercent = withSalaryData.length
      ? withSalaryData.reduce(
          (sum, p) =>
            sum +
            ((p.salaryAfterProgram - p.salaryBeforeProgram) /
              p.salaryBeforeProgram) *
              100,
          0,
        ) / withSalaryData.length
      : null;

    return {
      total,
      byType,
      avgSalaryChangeAmount,
      avgSalaryChangePercent,
      recordsWithSalaryData: withSalaryData.length,
    };
  }
}
