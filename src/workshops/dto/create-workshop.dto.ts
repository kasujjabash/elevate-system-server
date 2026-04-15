import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WorkshopType {
  Workshop = 'Workshop',
  Podcast = 'Podcast',
}

export class CreateWorkshopDto {
  @ApiProperty({ description: 'Workshop title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Workshop description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Workshop type - Workshop or Podcast',
    enum: WorkshopType,
    default: WorkshopType.Workshop,
  })
  @IsOptional()
  type?: WorkshopType;

  @ApiPropertyOptional({ description: 'Workshop URL' })
  @IsString()
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ description: 'Course ID' })
  @IsInt()
  @IsOptional()
  courseId?: number;

  @ApiPropertyOptional({ description: 'Hub ID' })
  @IsInt()
  @IsOptional()
  hubId?: number;
}
