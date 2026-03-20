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

  async findByContact(contactId: number) {
    // Find student from contactId, then get their submissions/assignments
    const student = await this.prisma.student.findFirst({
      where: { contactId },
      select: { id: true },
    });
    if (!student) return [];

    const submissions = await this.prisma.submission.findMany({
      where: { studentId: student.id },
      include: { assignment: { include: { course: true } } },
    });

    return submissions.map((s) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      title: s.assignment.title,
      courseName: s.assignment.course.title,
      status: s.status,
      score: s.score,
      submittedAt: s.submittedAt,
      dueDate: s.assignment.dueDate,
    }));
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
