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
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.WorkshopsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
const create_workshop_dto_1 = require('./dto/create-workshop.dto');
let WorkshopsService = class WorkshopsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(dto) {
    let workshopType = dto.type;
    if (
      !workshopType ||
      ![
        create_workshop_dto_1.WorkshopType.Workshop,
        create_workshop_dto_1.WorkshopType.Podcast,
      ].includes(workshopType)
    ) {
      workshopType = create_workshop_dto_1.WorkshopType.Workshop;
    }
    return this.prisma.workshop.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: workshopType,
        url: dto.url,
        courseId: dto.courseId,
        hubId: dto.hubId,
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        hub: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async findAll(isActive) {
    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    const workshops = await this.prisma.workshop.findMany({
      where,
      include: {
        course: {
          select: {
            title: true,
          },
        },
        hub: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return workshops.map((workshop) => ({
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      type: workshop.type,
      url: workshop.url,
      courseName: workshop.course?.title || null,
      hubName: workshop.hub?.name || null,
      createdAt: workshop.createdAt,
    }));
  }
  async findOne(id) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        hub: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!workshop) {
      throw new common_1.NotFoundException('Workshop not found');
    }
    return {
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      type: workshop.type,
      url: workshop.url,
      courseName: workshop.course?.title || null,
      hubName: workshop.hub?.name || null,
      createdAt: workshop.createdAt,
    };
  }
  async update(id, dto) {
    const existingWorkshop = await this.prisma.workshop.findUnique({
      where: { id },
    });
    if (!existingWorkshop) {
      throw new common_1.NotFoundException('Workshop not found');
    }
    const data = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.url !== undefined) data.url = dto.url;
    if (dto.courseId !== undefined) data.courseId = dto.courseId;
    if (dto.hubId !== undefined) data.hubId = dto.hubId;
    const updatedWorkshop = await this.prisma.workshop.update({
      where: { id },
      data,
      include: {
        course: {
          select: {
            title: true,
          },
        },
        hub: {
          select: {
            name: true,
          },
        },
      },
    });
    return {
      id: updatedWorkshop.id,
      title: updatedWorkshop.title,
      description: updatedWorkshop.description,
      type: updatedWorkshop.type,
      url: updatedWorkshop.url,
      courseName: updatedWorkshop.course?.title || null,
      hubName: updatedWorkshop.hub?.name || null,
      createdAt: updatedWorkshop.createdAt,
    };
  }
  async remove(id) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
    });
    if (!workshop) {
      throw new common_1.NotFoundException('Workshop not found');
    }
    return this.prisma.workshop.delete({
      where: { id },
    });
  }
};
exports.WorkshopsService = WorkshopsService;
exports.WorkshopsService = WorkshopsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  WorkshopsService,
);
//# sourceMappingURL=workshops.service.js.map
