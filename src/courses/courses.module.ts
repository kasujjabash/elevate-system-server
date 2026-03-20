import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { SkillCategoriesService } from './skill-categories.service';
import { StudyResourcesService } from './study-resources.service';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { ExamsController } from './exams.controller';
import { ModulesService } from './modules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaService } from '../shared/prisma.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([])],
  providers: [
    CoursesService,
    SkillCategoriesService,
    StudyResourcesService,
    AssignmentsService,
    ModulesService,
    PrismaService,
  ],
  controllers: [CoursesController, AssignmentsController, ExamsController],
  exports: [
    CoursesService,
    SkillCategoriesService,
    StudyResourcesService,
    AssignmentsService,
    ModulesService,
  ],
})
export class CoursesModule {}
