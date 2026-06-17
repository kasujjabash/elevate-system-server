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
exports.ChatRoomsService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../shared/prisma.service');
let ChatRoomsService = class ChatRoomsService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async getRooms(userId) {
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
    const allUserIds = new Set();
    memberships.forEach((m) =>
      m.room.members.forEach((mm) => allUserIds.add(mm.userId)),
    );
    const users = await this.prisma.user.findMany({
      where: { id: { in: [...allUserIds] } },
      include: { contact: { include: { person: true } } },
    });
    const resolveName = (u) => {
      if (!u) return null;
      if (u.contact?.person) {
        const p = u.contact.person;
        return `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || null;
      }
      return u.username ?? null;
    };
    const nameMap = new Map();
    users.forEach((u) => {
      const name = resolveName(u);
      if (name) nameMap.set(u.id, name);
    });
    return memberships.map((m) => {
      const room = m.room;
      const last = room.messages[0] ?? null;
      const otherMember = room.members.find((mm) => mm.userId !== userId);
      const participants = room.members.map((mm) => ({
        userId: mm.userId,
        name: nameMap.get(mm.userId) ?? null,
      }));
      const displayTitle =
        room.type === 'direct'
          ? otherMember
            ? nameMap.get(otherMember.userId) ?? room.title
            : room.title
          : room.title;
      return {
        id: room.id,
        type: room.type,
        title: displayTitle,
        courseId: room.courseId,
        courseName: room.course?.title ?? null,
        memberCount: room.members.length,
        participants,
        lastMessage: last
          ? { content: last.content, createdAt: last.createdAt }
          : null,
      };
    });
  }
  async createRoom(userId, body) {
    if (body.type === 'direct') {
      if (!body.participantId)
        throw new common_1.ForbiddenException('participantId required');
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
    const room = await this.prisma.chat_room.create({
      data: {
        type: 'group',
        title: body.title ?? null,
        courseId: body.courseId ?? null,
        members: { create: [{ userId }] },
      },
    });
    if (body.courseId) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { courseId: body.courseId },
        include: {
          student: { include: { contact: { include: { user: true } } } },
        },
      });
      const userIds = enrollments
        .map((e) => e.student?.contact?.user?.id)
        .filter((id) => !!id && id !== userId);
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
  async getMessages(roomId, userId) {
    const member = await this.prisma.chat_member.findFirst({
      where: { roomId, userId },
    });
    if (!member)
      throw new common_1.ForbiddenException('Not a member of this room');
    const messages = await this.prisma.chat_message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });
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
  async sendMessage(roomId, userId, content) {
    const member = await this.prisma.chat_member.findFirst({
      where: { roomId, userId },
    });
    if (!member)
      throw new common_1.ForbiddenException('Not a member of this room');
    const message = await this.prisma.chat_message.create({
      data: { roomId, senderId: userId, content },
    });
    return message;
  }
  async getContacts(userId, roles) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { contactId: true, hubId: true },
    });
    if (!user) return [];
    const userIds = new Set();
    const isStudent = roles.some((r) => r.toLowerCase().includes('student'));
    const isAdmin = roles.some((r) =>
      ['admin', 'super_admin'].some((k) => r.toLowerCase().includes(k)),
    );
    if (isAdmin) {
      const all = await this.prisma.user.findMany({
        where: { isActive: true, id: { not: userId } },
        select: { id: true },
      });
      all.forEach((u) => userIds.add(u.id));
    } else if (isStudent) {
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
      if (user.hubId) {
        const students = await this.prisma.student.findMany({
          where: { hubId: user.hubId },
          include: { contact: { include: { user: true } } },
        });
        students.forEach((s) => {
          const uid = s.contact?.user?.id;
          if (uid && uid !== userId) userIds.add(uid);
        });
        const colleagues = await this.prisma.user.findMany({
          where: { hubId: user.hubId, isActive: true, id: { not: userId } },
          select: { id: true },
        });
        colleagues.forEach((c) => userIds.add(c.id));
      }
      const instructor = await this.prisma.instructor.findFirst({
        where: { contactId: user.contactId ?? userId },
        select: { id: true },
      });
      if (instructor) {
        const trainerCourses = await this.prisma.course.findMany({
          where: { instructorId: instructor.id },
          select: { id: true },
        });
        if (trainerCourses.length) {
          const enrollments = await this.prisma.enrollment.findMany({
            where: { courseId: { in: trainerCourses.map((c) => c.id) } },
            include: {
              student: { include: { contact: { include: { user: true } } } },
            },
          });
          enrollments.forEach((e) => {
            const uid = e.student?.contact?.user?.id;
            if (uid && uid !== userId) userIds.add(uid);
          });
        }
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
};
exports.ChatRoomsService = ChatRoomsService;
exports.ChatRoomsService = ChatRoomsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [prisma_service_1.PrismaService]),
  ],
  ChatRoomsService,
);
//# sourceMappingURL=chat-rooms.service.js.map
