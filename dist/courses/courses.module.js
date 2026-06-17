'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CoursesModule = void 0;
const common_1 = require('@nestjs/common');
const axios_1 = require('@nestjs/axios');
const courses_service_1 = require('./courses.service');
const courses_controller_1 = require('./courses.controller');
const skill_categories_service_1 = require('./skill-categories.service');
const study_resources_service_1 = require('./study-resources.service');
const assignments_service_1 = require('./assignments.service');
const assignments_controller_1 = require('./assignments.controller');
const exams_controller_1 = require('./exams.controller');
const modules_service_1 = require('./modules.service');
const typeorm_1 = require('@nestjs/typeorm');
const prisma_service_1 = require('../shared/prisma.service');
let CoursesModule = class CoursesModule {};
exports.CoursesModule = CoursesModule;
exports.CoursesModule = CoursesModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([])],
      providers: [
        courses_service_1.CoursesService,
        skill_categories_service_1.SkillCategoriesService,
        study_resources_service_1.StudyResourcesService,
        assignments_service_1.AssignmentsService,
        modules_service_1.ModulesService,
        prisma_service_1.PrismaService,
      ],
      controllers: [
        courses_controller_1.CoursesController,
        assignments_controller_1.AssignmentsController,
        exams_controller_1.ExamsController,
      ],
      exports: [
        courses_service_1.CoursesService,
        skill_categories_service_1.SkillCategoriesService,
        study_resources_service_1.StudyResourcesService,
        assignments_service_1.AssignmentsService,
        modules_service_1.ModulesService,
      ],
    }),
  ],
  CoursesModule,
);
//# sourceMappingURL=courses.module.js.map
