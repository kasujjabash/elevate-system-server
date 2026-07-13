import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityReachService } from './community-reach.service';
import { CreateCommunityReachDto } from './dto/create-community-reach.dto';

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
      'Only admins and hub managers can manage community reach records',
    );
  }
}

@ApiTags('community-reach')
@ApiBearerAuth()
@Controller('api/community-reach')
export class CommunityReachController {
  constructor(private readonly communityReachService: CommunityReachService) {}

  @Get()
  findAll(
    @Query('hubId') hubId?: string,
    @Query('reachMethod') reachMethod?: string,
  ) {
    return this.communityReachService.findAll({
      hubId: hubId ? parseInt(hubId, 10) : undefined,
      reachMethod,
    });
  }

  // Must be declared before the `:id` route below, otherwise "stats" would
  // be parsed as an id.
  @Get('stats')
  getStats() {
    return this.communityReachService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.communityReachService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCommunityReachDto, @Request() req: any) {
    requireAdminOrHubManager(req);
    return this.communityReachService.create(
      dto,
      req.user?.id ?? req.user?.userId,
    );
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommunityReachDto,
    @Request() req: any,
  ) {
    requireAdminOrHubManager(req);
    return this.communityReachService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    requireAdminOrHubManager(req);
    return this.communityReachService.remove(id);
  }
}
