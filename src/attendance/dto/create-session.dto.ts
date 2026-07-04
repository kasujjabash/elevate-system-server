import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiPropertyOptional({
    description: 'Optional label (e.g. "Week 4 - Monday Class")',
  })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ description: 'Course ID to associate with session' })
  @IsInt()
  @Min(1)
  @IsOptional()
  courseId?: number;

  @ApiPropertyOptional({ description: 'Event ID to associate with session' })
  @IsInt()
  @Min(1)
  @IsOptional()
  eventId?: number;

  @ApiProperty({
    description: 'Hub ID — required for every attendance session',
  })
  @IsInt()
  @Min(1)
  hubId: number;

  @ApiPropertyOptional({
    description: 'Minutes until token expires (default: 30)',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationMinutes?: number;
}
