import { Module } from '@nestjs/common';
import { PlacementsController } from './placements.controller';
import { PlacementsService } from './placements.service';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [PlacementsController],
  providers: [PlacementsService, PrismaService],
})
export class PlacementsModule {}
