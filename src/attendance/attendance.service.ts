import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  private generateShortCode(): string {
    // 6 chars, no ambiguous chars (0/O, 1/I/L)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    const bytes = randomBytes(6);
    for (let i = 0; i < 6; i++) {
      code += chars[bytes[i] % chars.length];
    }
    return code;
  }

  async createSession(dto: CreateSessionDto, createdBy: number) {
    const token = randomBytes(24).toString('hex');
    const shortCode = this.generateShortCode();
    const durationMinutes = dto.durationMinutes ?? 30;
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const session = await this.prisma.attendance_session.create({
      data: {
        token,
        shortCode,
        label: dto.label,
        courseId: dto.courseId,
        hubId: dto.hubId,
        expiresAt,
        createdBy,
      },
      include: {
        course: { select: { id: true, title: true } },
        hub: { select: { id: true, name: true } },
        _count: { select: { records: true } },
      },
    });

    return session;
  }

  async getSessions(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      this.prisma.attendance_session.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true } },
          hub: { select: { id: true, name: true } },
          _count: { select: { records: true } },
        },
      }),
      this.prisma.attendance_session.count(),
    ]);

    return { sessions, total, page, limit };
  }

  async getSession(id: number) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        hub: { select: { id: true, name: true } },
        records: {
          orderBy: { checkedInAt: 'asc' },
          include: {
            student: {
              select: {
                id: true,
                studentId: true,
                contact: {
                  select: {
                    person: { select: { firstName: true, lastName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async closeSession(id: number) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { id },
    });
    if (!session) throw new NotFoundException('Session not found');

    return this.prisma.attendance_session.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async checkIn(token: string, contactId: number) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { token },
    });

    if (!session) throw new NotFoundException('Invalid QR code');
    if (!session.isActive)
      throw new BadRequestException('This attendance session is closed');
    if (new Date() > session.expiresAt) {
      await this.prisma.attendance_session.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      throw new BadRequestException('This QR code has expired');
    }

    // Find student by contactId (matches the JWT payload field)
    const student = await this.prisma.student.findUnique({
      where: { contactId },
      select: { id: true, studentId: true },
    });
    if (!student)
      throw new NotFoundException('No student record found for your account');

    try {
      const record = await this.prisma.attendance_record.create({
        data: {
          sessionId: session.id,
          studentId: student.id,
          method: 'QR',
        },
        include: {
          student: {
            select: {
              studentId: true,
              contact: {
                select: {
                  person: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message: 'Checked in successfully!',
        record,
        session: { id: session.id, label: session.label },
      };
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException(
          'You have already checked in to this session',
        );
      }
      throw e;
    }
  }

  async checkInByCode(code: string, contactId: number) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { shortCode: code.toUpperCase().trim() },
    });

    if (!session)
      throw new NotFoundException('Invalid code — please check and try again');
    if (!session.isActive)
      throw new BadRequestException('This attendance session is closed');
    if (new Date() > session.expiresAt) {
      await this.prisma.attendance_session.update({
        where: { id: session.id },
        data: { isActive: false },
      });
      throw new BadRequestException('This session code has expired');
    }

    const student = await this.prisma.student.findUnique({
      where: { contactId },
      select: { id: true, studentId: true },
    });
    if (!student)
      throw new NotFoundException('No student record found for your account');

    try {
      const record = await this.prisma.attendance_record.create({
        data: { sessionId: session.id, studentId: student.id, method: 'Code' },
        include: {
          student: {
            select: {
              studentId: true,
              contact: {
                select: {
                  person: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message: 'Checked in successfully!',
        record,
        session: { id: session.id, label: session.label },
      };
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException(
          'You have already checked in to this session',
        );
      }
      throw e;
    }
  }

  async getSessionByToken(token: string) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { token },
      include: {
        course: { select: { id: true, title: true } },
        hub: { select: { id: true, name: true } },
        _count: { select: { records: true } },
      },
    });

    if (!session) throw new NotFoundException('Invalid QR code');
    return session;
  }

  async addManual(sessionId: number, studentDbId: number) {
    const session = await this.prisma.attendance_session.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');

    try {
      return await this.prisma.attendance_record.create({
        data: { sessionId, studentId: studentDbId, method: 'Manual' },
      });
    } catch (e: any) {
      if (e.code === 'P2002')
        throw new ConflictException('Student already checked in');
      throw e;
    }
  }
}
