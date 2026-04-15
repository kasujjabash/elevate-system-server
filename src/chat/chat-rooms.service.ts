import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class ChatRoomsService {
  constructor(private prisma: PrismaService) {}

  // ── GET /api/chat/rooms ────────────────────────────────────────────────────
  async getRooms(userId: number) {
    const memberships = await this.prisma.chat_member.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            members: true,
            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
            course: { select: { id: true, title: true } },
          },
        },
      },
    });

    return memberships.map((m) => {
      const room = m.room;
      const last = room.messages[0] ?? null;
      return {
        id: room.id,
        type: room.type,
        title: room.title,
        courseId: room.courseId,
        courseName: room.course?.title ?? null,
        memberCount: room.members.length,
        lastMessage: last
          ? { content: last.content, createdAt: last.createdAt }
          : null,
      };
    });
  }

  // ── POST /api/chat/rooms ───────────────────────────────────────────────────
  async createRoom(
    userId: number,
    body: {
      type: 'group' | 'direct';
      courseId?: number;
      title?: string;
      participantId?: number;
    },
  ) {
    if (body.type === 'direct') {
      if (!body.participantId)
        throw new ForbiddenException('participantId required');

      // Return existing direct room if one already exists
      const existing = await this.prisma.chat_member.findFirst({
        where: { userId },
        include: { room: { include: { members: true } } },
      });

      if (existing) {
        const directRooms = await this.prisma.chat_room.findMany({
          where: {
            type: 'direct',
            members: { some: { userId } },
          },
          include: { members: true },
        });
        const found = directRooms.find(
          (r) =>
            r.members.length === 2 &&
            r.members.some((mm) => mm.userId === body.participantId),
        );
        if (found)
          return { id: found.id, type: found.type, title: found.title };
      }

      const room = await this.prisma.chat_room.create({
        data: {
          type: 'direct',
          members: {
            create: [{ userId }, { userId: body.participantId }],
          },
        },
      });
      return { id: room.id, type: room.type, title: room.title };
    }

    // Group room
    const room = await this.prisma.chat_room.create({
      data: {
        type: 'group',
        title: body.title ?? null,
        courseId: body.courseId ?? null,
        members: { create: [{ userId }] },
      },
    });

    // Auto-add all enrolled students + instructor if courseId provided
    if (body.courseId) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { courseId: body.courseId },
        include: {
          student: { include: { contact: { include: { user: true } } } },
        },
      });
      const userIds = enrollments
        .map((e) => e.student?.contact?.user?.id)
        .filter((id): id is number => !!id && id !== userId);

      if (userIds.length) {
        await this.prisma.chat_member.createMany({
          data: userIds.map((uid) => ({ roomId: room.id, userId: uid })),
          skipDuplicates: true,
        });
      }
    }

    return {
      id: room.id,
      type: room.type,
      title: room.title,
      courseId: room.courseId,
    };
  }

  // ── GET /api/chat/rooms/:id/messages ──────────────────────────────────────
  async getMessages(roomId: number, userId: number) {
    const member = await this.prisma.chat_member.findFirst({
      where: { roomId, userId },
    });
    if (!member) throw new ForbiddenException('Not a member of this room');

    const messages = await this.prisma.chat_message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });

    // Resolve sender names
    const senderIds = [...new Set(messages.map((m) => m.senderId))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: senderIds } },
      include: { contact: { include: { person: true } } },
    });
    const nameMap = new Map(
      users.map((u) => [
        u.id,
        u.contact?.person
          ? `${u.contact.person.firstName} ${u.contact.person.lastName}`.trim()
          : u.username,
      ]),
    );

    return messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: nameMap.get(m.senderId) ?? 'Unknown',
      content: m.content,
      createdAt: m.createdAt,
    }));
  }

  // ── POST /api/chat/rooms/:id/messages ─────────────────────────────────────
  async sendMessage(roomId: number, userId: number, content: string) {
    const member = await this.prisma.chat_member.findFirst({
      where: { roomId, userId },
    });
    if (!member) throw new ForbiddenException('Not a member of this room');

    const message = await this.prisma.chat_message.create({
      data: { roomId, senderId: userId, content },
    });
    return message;
  }

  // ── GET /api/chat/contacts ─────────────────────────────────────────────────
  async getContacts(userId: number, roles: string[]) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { contactId: true, hubId: true },
    });
    if (!user) return [];

    const userIds = new Set<number>();

    const isStudent = roles.some((r) => r.toLowerCase().includes('student'));
    const isAdmin = roles.some((r) =>
      ['admin', 'super_admin'].some((k) => r.toLowerCase().includes(k)),
    );

    if (isAdmin) {
      // Admin sees everyone
      const all = await this.prisma.user.findMany({
        where: { isActive: true, id: { not: userId } },
        select: { id: true },
      });
      all.forEach((u) => userIds.add(u.id));
    } else if (isStudent) {
      // Student sees classmates + instructor + hub manager
      const student = await this.prisma.student.findFirst({
        where: { contactId: user.contactId },
        select: { id: true, hubId: true },
      });
      if (student) {
        const enrollments = await this.prisma.enrollment.findMany({
          where: { studentId: student.id },
          select: { courseId: true },
        });
        const courseIds = enrollments.map((e) => e.courseId);

        // Classmates
        const classmates = await this.prisma.enrollment.findMany({
          where: {
            courseId: { in: courseIds },
            studentId: { not: student.id },
          },
          include: {
            student: { include: { contact: { include: { user: true } } } },
          },
        });
        classmates.forEach((e) => {
          const uid = e.student?.contact?.user?.id;
          if (uid) userIds.add(uid);
        });

        // Instructors for those courses
        const courses = await this.prisma.course.findMany({
          where: { id: { in: courseIds } },
          include: {
            instructor: { include: { contact: { include: { user: true } } } },
          },
        });
        courses.forEach((c) => {
          const uid = c.instructor?.contact?.user?.id;
          if (uid) userIds.add(uid);
        });

        // Hub manager
        if (student.hubId) {
          const managers = await this.prisma.user.findMany({
            where: { hubId: student.hubId, isActive: true },
            select: { id: true, roles: true },
          });
          managers
            .filter((m) => m.roles?.toLowerCase().includes('hub_manager'))
            .forEach((m) => userIds.add(m.id));
        }
      }
    } else {
      // Trainer/Hub manager sees students in their hub/courses
      if (user.hubId) {
        const students = await this.prisma.student.findMany({
          where: { hubId: user.hubId },
          include: { contact: { include: { user: true } } },
        });
        students.forEach((s) => {
          const uid = s.contact?.user?.id;
          if (uid && uid !== userId) userIds.add(uid);
        });
        // Also hub colleagues
        const colleagues = await this.prisma.user.findMany({
          where: { hubId: user.hubId, isActive: true, id: { not: userId } },
          select: { id: true },
        });
        colleagues.forEach((c) => userIds.add(c.id));
      }
    }

    if (!userIds.size) return [];

    const contacts = await this.prisma.user.findMany({
      where: { id: { in: [...userIds] }, isActive: true },
      include: { contact: { include: { person: true, email: true } } },
    });

    return contacts.map((u) => ({
      id: u.id,
      name: u.contact?.person
        ? `${u.contact.person.firstName} ${u.contact.person.lastName}`.trim()
        : u.username,
      email: u.username,
      avatar: u.contact?.person?.avatar ?? null,
      roles: u.roles ?? '',
    }));
  }
}
