import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { TimetableController } from './timetable.controller';
import { ClassesService } from './classes.service';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [ClassesController, TimetableController],
  providers: [ClassesService, PrismaService],
  exports: [ClassesService],
})
export class ClassesModule {}
