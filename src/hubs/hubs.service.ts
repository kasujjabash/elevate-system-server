import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';

@Injectable()
export class HubsService {
  constructor(private prisma: PrismaService) {}

  async create(createHubDto: CreateHubDto) {
    return this.prisma.hub.create({
      data: createHubDto,
    });
  }

  async findAll() {
    return this.prisma.hub.findMany({
      include: {
        students: true,
        courses: true,
        instructors: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.hub.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            contact: {
              include: {
                person: true,
              },
            },
          },
        },
        courses: {
          include: {
            instructor: {
              include: {
                contact: {
                  include: {
                    person: true,
                  },
                },
              },
            },
            skillCategory: true,
          },
        },
        instructors: {
          include: {
            contact: {
              include: {
                person: true,
              },
            },
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.hub.findUnique({
      where: { code },
      include: {
        students: true,
        courses: true,
        instructors: true,
      },
    });
  }

  async update(id: number, updateHubDto: UpdateHubDto) {
    return this.prisma.hub.update({
      where: { id },
      data: updateHubDto,
    });
  }

  async remove(id: number) {
    return this.prisma.hub.delete({
      where: { id },
    });
  }

  async getHubStatistics(id: number) {
    const hub = await this.prisma.hub.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            courses: true,
            instructors: true,
          },
        },
      },
    });

    if (!hub) {
      throw new Error('Hub not found');
    }

    return {
      ...hub,
      statistics: hub._count,
    };
  }
}
