import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@ApiTags('workshops')
@UseGuards(JwtAuthGuard)
@Controller('api/workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Workshop created successfully',
  })
  create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopsService.create(createWorkshopDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all workshops',
  })
  findAll(@Query('isActive') isActive?: string) {
    return this.workshopsService.findAll(isActive);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a workshop by ID',
  })
  @ApiResponse({
    status: 404,
    description: 'Workshop not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workshopsService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Workshop updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workshop not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopsService.update(id, updateWorkshopDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Workshop deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workshop not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workshopsService.remove(id);
  }
}
