import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssignmentDto: any) {
    return this.prisma.assignment.create({
      data: createAssignmentDto,
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.assignment.findMany({
      where: { courseId },
      include: {
        course: true,
        submissions: {
          include: {
            student: {
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

  async findOne(id: number) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: true,
      },
    });
  }

  async submitAssignment(
    assignmentId: number,
    studentId: number,
    submissionData: any,
  ) {
    return this.prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        ...submissionData,
      },
    });
  }
}
