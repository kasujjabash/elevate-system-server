import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { WorkshopsService } from './workshops.service';
import { WorkshopsController } from './workshops.controller';

@Module({
  providers: [WorkshopsService, PrismaService],
  controllers: [WorkshopsController],
  exports: [WorkshopsService],
})
export class WorkshopsModule {}
