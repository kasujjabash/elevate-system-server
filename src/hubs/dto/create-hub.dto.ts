import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
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
}
