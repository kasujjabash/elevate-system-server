import { Module } from '@nestjs/common';
import { JobPlacementsController } from './job-placements.controller';
import { JobPlacementsService } from './job-placements.service';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [JobPlacementsController],
  providers: [JobPlacementsService, PrismaService],
})
export class JobPlacementsModule {}
