import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateWorkshopDto, WorkshopType } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkshopDto) {
    // Validate and set default type if not provided or invalid
    let workshopType = dto.type;
    if (
      !workshopType ||
      ![WorkshopType.Workshop, WorkshopType.Podcast].includes(workshopType)
    ) {
      workshopType = WorkshopType.Workshop;
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

  async findAll(isActive?: string) {
    const where: any = {};
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

  async findOne(id: number) {
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
      throw new NotFoundException('Workshop not found');
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

  async update(id: number, dto: UpdateWorkshopDto) {
    // Check if workshop exists
    const existingWorkshop = await this.prisma.workshop.findUnique({
      where: { id },
    });

    if (!existingWorkshop) {
      throw new NotFoundException('Workshop not found');
    }

    const data: any = {};
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

  async remove(id: number) {
    // Check if workshop exists
    const workshop = await this.prisma.workshop.findUnique({
      where: { id },
    });

    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }

    return this.prisma.workshop.delete({
      where: { id },
    });
  }
}
