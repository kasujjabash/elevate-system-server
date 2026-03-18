import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentHubController } from './student-hub.controller';
import { EnrollmentService } from './enrollment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaService } from '../shared/prisma.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([])],
  providers: [StudentsService, EnrollmentService, PrismaService],
  controllers: [StudentsController, StudentHubController],
  exports: [StudentsService, EnrollmentService],
})
export class StudentsModule {}
