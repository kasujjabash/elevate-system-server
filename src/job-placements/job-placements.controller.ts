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
import { JobPlacementsService } from './job-placements.service';
import { CreateJobPlacementDto } from './dto/create-job-placement.dto';

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

@ApiTags('job-placements')
@ApiBearerAuth()
@Controller('api/job-placements')
export class JobPlacementsController {
  constructor(private readonly jobPlacementsService: JobPlacementsService) {}

  @Get()
  findAll() {
    return this.jobPlacementsService.findAll();
  }

  // Must be declared before the `:id` route below, otherwise "stats" would
  // be parsed as an id.
  @Get('stats')
  getStats() {
    return this.jobPlacementsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobPlacementsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateJobPlacementDto, @Request() req: any) {
    requireAdminOrHubManager(req);
    return this.jobPlacementsService.create(
      dto,
      req.user?.id ?? req.user?.userId,
    );
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateJobPlacementDto,
    @Request() req: any,
  ) {
    requireAdminOrHubManager(req);
    return this.jobPlacementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    requireAdminOrHubManager(req);
    return this.jobPlacementsService.remove(id);
  }
}
