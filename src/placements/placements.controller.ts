import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlacementsService } from './placements.service';
import { CreatePlacementDto } from './dto/create-placement.dto';

const ADMIN_ROLES = ['admin', 'super_admin', 'hub_manager'];

function requireAdminOrHubManager(req: any) {
  const raw = req?.user?.roles;
  const roles: string[] = Array.isArray(raw)
    ? raw
    : (raw || '')
        .split(',')
        .map((r: string) => r.trim())
        .filter(Boolean);
  if (!roles.some((r) => ADMIN_ROLES.includes(r.toLowerCase()))) {
    throw new ForbiddenException(
      'Only admins and hub managers can manage placement records',
    );
  }
}

@ApiTags('placements')
@ApiBearerAuth()
@Controller('api/job-placements')
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  @Get()
  findAll() {
    return this.placementsService.findAll();
  }

  @Post()
  create(@Body() dto: CreatePlacementDto, @Request() req: any) {
    requireAdminOrHubManager(req);
    return this.placementsService.create(dto, req.user?.id ?? req.user?.userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePlacementDto,
    @Request() req: any,
  ) {
    requireAdminOrHubManager(req);
    return this.placementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    requireAdminOrHubManager(req);
    return this.placementsService.remove(id);
  }
}
