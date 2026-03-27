import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { TimetableController } from './timetable.controller';
import { ClassesService } from './classes.service';
import { TimetableService } from './timetable.service';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [ClassesController, TimetableController],
  providers: [ClassesService, TimetableService, PrismaService],
  exports: [ClassesService, TimetableService],
})
export class ClassesModule {}
