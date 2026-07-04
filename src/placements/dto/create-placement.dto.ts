import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const PLACEMENT_TYPES = ['Employed', 'SelfEmployed', 'Freelance', 'Internship'];

export class CreatePlacementDto {
  @ApiProperty({ description: 'Full name of the placed person' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Gender' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Phone / WhatsApp number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Course they took' })
  @IsInt()
  @Min(1)
  courseId: number;

  @ApiProperty({ description: 'Hub they trained at' })
  @IsInt()
  @Min(1)
  hubId: number;

  @ApiPropertyOptional({ description: 'Year the course was completed' })
  @IsInt()
  @Min(1900)
  @IsOptional()
  yearCompleted?: number;

  @ApiProperty({
    description: 'Placement outcome',
    enum: PLACEMENT_TYPES,
  })
  @IsIn(PLACEMENT_TYPES)
  placementType: string;

  // ── Employed / Self-Employed ──────────────────────────────────────────
  @ApiPropertyOptional({ description: 'Job title / what they do' })
  @ValidateIf((o) => o.placementType !== 'Internship')
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Monthly salary before the program' })
  @ValidateIf((o) => o.placementType !== 'Internship')
  @IsNumber()
  @IsOptional()
  salaryBeforeProgram?: number;

  @ApiPropertyOptional({ description: 'Monthly salary after the program' })
  @ValidateIf((o) => o.placementType !== 'Internship')
  @IsNumber()
  @IsOptional()
  salaryAfterProgram?: number;

  // ── Employed only ─────────────────────────────────────────────────────
  @ApiPropertyOptional({ description: 'Company name' })
  @ValidateIf((o) => o.placementType === 'Employed')
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Industry',
    enum: ['Tech', 'Design', 'Media', 'Other'],
  })
  @ValidateIf((o) => o.placementType === 'Employed')
  @IsIn(['Tech', 'Design', 'Media', 'Other'])
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({
    description: 'Employment type',
    enum: ['FullTime', 'PartTime', 'Freelance', 'Internship'],
  })
  @ValidateIf((o) => o.placementType === 'Employed')
  @IsIn(['FullTime', 'PartTime', 'Freelance', 'Internship'])
  @IsOptional()
  employmentType?: string;

  @ApiPropertyOptional({ description: 'Who referred/recruited them' })
  @ValidateIf((o) => o.placementType === 'Employed')
  @IsString()
  @IsOptional()
  referredBy?: string;

  // ── Internship only ───────────────────────────────────────────────────
  @ApiPropertyOptional({ description: 'Organization they are interning at' })
  @ValidateIf((o) => o.placementType === 'Internship')
  @IsString()
  @IsOptional()
  internshipOrganization?: string;

  @ApiPropertyOptional({ description: 'Role / what they do' })
  @ValidateIf((o) => o.placementType === 'Internship')
  @IsString()
  @IsOptional()
  internshipRole?: string;

  @ApiPropertyOptional({ description: 'Supervisor / who they work for' })
  @ValidateIf((o) => o.placementType === 'Internship')
  @IsString()
  @IsOptional()
  internshipSupervisor?: string;
}
