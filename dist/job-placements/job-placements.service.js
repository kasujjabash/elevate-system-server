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
exports.JobPlacementsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
const INCLUDE = {
  course: { select: { id: true, title: true } },
  hub: { select: { id: true, name: true } },
};
const PLACEMENT_TYPES = ['Employed', 'SelfEmployed', 'Freelance', 'Internship'];
let JobPlacementsService = class JobPlacementsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  formatPlacement(placement) {
    const { salaryBeforeProgram: before, salaryAfterProgram: after } =
      placement;
    const incomeGrowthPercent =
      before && after ? ((after - before) / before) * 100 : null;
    return { ...placement, incomeGrowthPercent };
  }
  async create(dto, createdBy) {
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
        isPaidInternship: dto.isPaidInternship ?? false,
        internshipStipend: dto.isPaidInternship
          ? dto.internshipStipend ?? null
          : null,
        createdBy: createdBy ?? null,
      },
      include: INCLUDE,
    });
    return this.formatPlacement(placement);
  }
  async update(id, dto) {
    const existing = await this.prisma.job_placement.findUnique({
      where: { id },
    });
    if (!existing)
      throw new common_1.NotFoundException('Placement record not found');
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
        isPaidInternship: dto.isPaidInternship ?? false,
        internshipStipend: dto.isPaidInternship
          ? dto.internshipStipend ?? null
          : null,
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
  async findOne(id) {
    const placement = await this.prisma.job_placement.findUnique({
      where: { id },
      include: INCLUDE,
    });
    if (!placement)
      throw new common_1.NotFoundException('Placement record not found');
    return this.formatPlacement(placement);
  }
  async remove(id) {
    const placement = await this.prisma.job_placement.findUnique({
      where: { id },
    });
    if (!placement)
      throw new common_1.NotFoundException('Placement record not found');
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
    const byType = PLACEMENT_TYPES.reduce((acc, type) => {
      acc[type] = placements.filter((p) => p.placementType === type).length;
      return acc;
    }, {});
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
};
exports.JobPlacementsService = JobPlacementsService;
exports.JobPlacementsService = JobPlacementsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  JobPlacementsService,
);
//# sourceMappingURL=job-placements.service.js.map
