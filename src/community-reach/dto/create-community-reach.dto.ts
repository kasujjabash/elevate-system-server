import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const REACH_METHODS = ['Walk-in', 'Event', 'Referral', 'Social Media', 'Other'];

export class CreateCommunityReachDto {
  @ApiProperty({ description: 'Full name of the person reached' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Phone / WhatsApp number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Hub they were reached at/for' })
  @IsInt()
  @Min(1)
  hubId: number;

  @ApiProperty({
    description: 'How they were reached',
    enum: REACH_METHODS,
  })
  @IsIn(REACH_METHODS)
  reachMethod: string;

  @ApiPropertyOptional({
    description:
      'Calendar event they were reached at (when reachMethod = Event)',
  })
  @ValidateIf((o) => o.reachMethod === 'Event')
  @IsInt()
  @Min(1)
  @IsOptional()
  eventId?: number;
}
