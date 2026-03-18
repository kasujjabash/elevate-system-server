import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class StudyResourcesService {
  constructor(private prisma: PrismaService) {}

  async create(createStudyResourceDto: any) {
    return this.prisma.study_resource.create({
      data: createStudyResourceDto,
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.study_resource.findMany({
      where: { courseId },
      include: {
        course: true,
      },
    });
  }

  async findPublicResources() {
    return this.prisma.study_resource.findMany({
      where: { isPublic: true },
      include: {
        course: {
          include: {
            hub: true,
            skillCategory: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.study_resource.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
  }
}
