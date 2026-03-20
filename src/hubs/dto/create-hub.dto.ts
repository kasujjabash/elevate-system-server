import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHubDto {
  @ApiProperty({ description: 'Hub name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Hub code (unique identifier)' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Hub description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Hub location' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ description: 'Hub address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Whether the hub is active',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ description: 'Hub manager full name' })
  @IsString()
  @IsOptional()
  managerName?: string;

  @ApiPropertyOptional({ description: 'Hub manager phone number' })
  @IsString()
  @IsOptional()
  managerPhone?: string;

  @ApiPropertyOptional({ description: 'Hub manager email' })
  @IsString()
  @IsOptional()
  managerEmail?: string;

  @ApiPropertyOptional({ description: 'Number of computers' })
  @IsInt()
  @Min(0)
  @IsOptional()
  computers?: number;

  @ApiPropertyOptional({ description: 'Number of projectors' })
  @IsInt()
  @Min(0)
  @IsOptional()
  projectors?: number;

  @ApiPropertyOptional({ description: 'Maximum seating capacity' })
  @IsInt()
  @Min(0)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
