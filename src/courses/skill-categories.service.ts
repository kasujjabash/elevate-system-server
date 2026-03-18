import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class SkillCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createSkillCategoryDto: any) {
    return this.prisma.skill_category.create({
      data: createSkillCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.skill_category.findMany({
      include: {
        courses: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.skill_category.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            hub: true,
            instructor: {
              include: {
                contact: {
                  include: {
                    person: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
