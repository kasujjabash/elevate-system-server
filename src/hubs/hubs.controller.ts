import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('hubs')
@Controller('api/hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hub' })
  @ApiResponse({ status: 201, description: 'Hub created successfully' })
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubsService.create(createHubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hubs' })
  @ApiResponse({ status: 200, description: 'List of all hubs' })
  findAll() {
    return this.hubsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hub by ID' })
  @ApiResponse({ status: 200, description: 'Hub details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hubsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get hub by code' })
  @ApiResponse({ status: 200, description: 'Hub details' })
  findByCode(@Param('code') code: string) {
    return this.hubsService.findByCode(code);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get hub statistics' })
  @ApiResponse({
    status: 200,
    description: 'Hub statistics including student and course counts',
  })
  getStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.hubsService.getHubStatistics(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hub' })
  @ApiResponse({ status: 200, description: 'Hub updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHubDto: UpdateHubDto,
  ) {
    return this.hubsService.update(id, updateHubDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hub' })
  @ApiResponse({ status: 200, description: 'Hub deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hubsService.remove(id);
  }
}
