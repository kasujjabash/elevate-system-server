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
exports.AuthService = void 0;
const common_1 = require('@nestjs/common');
const users_service_1 = require('../users/users.service');
const auth_helpers_1 = require('./auth.helpers');
const mailer_1 = require('../utils/mailer');
const jwt_helpers_service_1 = require('./jwt-helpers.service');
const jwt_1 = require('@nestjs/jwt');
const constants_1 = require('./constants');
const prisma_service_1 = require('../shared/prisma.service');
let AuthService = class AuthService {
  constructor(usersService, jwtHelperService, jwtService, prisma) {
    this.usersService = usersService;
    this.jwtHelperService = jwtHelperService;
    this.jwtService = jwtService;
    this.prisma = prisma;
  }
  async validateUser(username, pass, _hub) {
    const user = await this.usersService.findByName(username);
    if (!user) {
      common_1.Logger.warn('Invalid username:', username);
      return null;
    }
    if (!user.isActive) {
      common_1.Logger.warn('User inactive:', username);
      return null;
    }
    const valid = await user.validatePassword(pass);
    if (!valid) {
      common_1.Logger.warn('Invalid password for:', username);
      return null;
    }
    (0, auth_helpers_1.cleanUpUser)(user);
    const dto = (0, auth_helpers_1.createUserDto)(user);
    if (!dto.roles?.length) {
      try {
        const dbUser = await this.prisma.user.findUnique({
          where: { id: user.id },
          select: { roles: true },
        });
        if (dbUser?.roles) {
          dto.roles = dbUser.roles
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean);
        }
      } catch (e) {
        common_1.Logger.warn(
          'Prisma roles fallback failed for user ' + user.id,
        );
      }
    }
    dto.permissions = await this.getPermissions(dto.roles);
    return dto;
  }
  async generateToken(user, tenant) {
    const userPermissions = await this.getPermissions(user.roles);
    user.permissions = userPermissions;
    let hubId = null;
    try {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { hubId: true },
      });
      hubId = dbUser?.hubId ?? null;
    } catch (e) {
      common_1.Logger.warn('Could not fetch hubId for user ' + user.id);
    }
    let tokenVersion = 0;
    try {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { tokenVersion: true },
      });
      tokenVersion = dbUser?.tokenVersion ?? 0;
    } catch (e) {
      common_1.Logger.warn('Could not fetch tokenVersion for user ' + user.id);
    }
    const payload = {
      ...user,
      sub: user.id,
      aud: tenant,
      permissions: userPermissions,
      hubId,
      tokenVersion,
    };
    const token = await this.jwtService.signAsync(payload);
    const hierarchy = await this.getUserHierarchy(user.id);
    return { token, user, hierarchy };
  }
  async decodeToken(token) {
    return this.jwtService.decode(token);
  }
  async forgotPassword(username) {
    const userExists = await this.usersService.findByName(username);
    const message =
      'An email has been sent to the provided address if it exists in our system';
    if (!userExists) {
      common_1.Logger.error('Provided email address not registered');
      return { token: '', mailURL: '', message };
    }
    const user = await this.usersService.findOne(userExists.id);
    const token = (await this.jwtHelperService.generateToken(user)).token;
    const resetLink = `${process.env.APP_URL}/#/reset-password/${token}`;
    const mailerData = {
      to: userExists.username,
      subject: 'Elevate Academy - Reset Password',
      html: `<p>Here is a link to reset your password!</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 10 minutes.</p>`,
    };
    const mailURL = await (0, mailer_1.sendEmail)(mailerData);
    return { token, mailURL, user };
  }
  async resetPassword(token, newPassword) {
    const decodedToken = await this.jwtHelperService.decodeToken(token);
    if (!decodedToken)
      throw new common_1.HttpException(
        'Incorrect Token, User not retrieved',
        404,
      );
    const userFromDb = await this.usersService.findOne(decodedToken.id);
    const data = {
      id: decodedToken.id,
      password: newPassword,
      roles: userFromDb.roles,
      isActive: userFromDb.isActive,
    };
    const user = await this.usersService.update(data);
    if (!user)
      throw new common_1.HttpException('User Password Not Updated', 404);
    const mailerData = {
      to: user.username,
      subject: 'Password Change Confirmation',
      html: `<h3>Hello ${user.fullName},</h3><p>Your password has been changed successfully!</p>`,
    };
    const mailURL = await (0, mailer_1.sendEmail)(mailerData);
    return { message: 'Password Change Successful', mailURL, user };
  }
  async getPermissions(roles) {
    const allRoleConfigs = [
      constants_1.roleSuperAdmin,
      constants_1.roleAdmin,
      constants_1.roleHubManager,
      constants_1.roleTrainer,
      constants_1.roleStudent,
    ];
    const permissions = [];
    for (const roleName of roles) {
      const found = allRoleConfigs.find(
        (r) => r.role.toLowerCase() === roleName.toLowerCase(),
      );
      if (found) permissions.push(...found.permissions);
    }
    return [...new Set(permissions)];
  }
  async refreshToken(_refreshToken) {
    return {
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };
  }
  async logout() {
    return { message: 'Logged out successfully' };
  }
  async getUserHierarchy(_userId) {
    return { myGroups: [] };
  }
  async getFullProfile(contactId) {
    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        person: true,
        email: true,
        phone: true,
        student: { include: { hub: true } },
      },
    });
    if (!contact) return null;
    const person = contact.person;
    const primaryEmail =
      contact.email.find((e) => e.isPrimary) ?? contact.email[0];
    const primaryPhone =
      contact.phone.find((p) => p.isPrimary) ?? contact.phone[0];
    const hub = contact.student?.hub;
    return {
      contactId: contact.id,
      firstName: person?.firstName ?? '',
      lastName: person?.lastName ?? '',
      middleName: person?.middleName ?? '',
      fullName: person ? `${person.firstName} ${person.lastName}`.trim() : '',
      gender: person?.gender ?? '',
      dateOfBirth: person?.dateOfBirth ?? null,
      avatar: person?.avatar ?? null,
      email: primaryEmail?.value ?? '',
      phone: primaryPhone?.value ?? '',
      hub: hub?.name ?? '',
      hubCode: hub?.code ?? '',
    };
  }
  async updateProfile(contactId, dto) {
    const { firstName, lastName, phone } = dto;
    if (firstName || lastName) {
      const existing = await this.prisma.person.findUnique({
        where: { contactId },
      });
      if (existing) {
        await this.prisma.person.update({
          where: { contactId },
          data: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
          },
        });
      }
    }
    if (phone !== undefined) {
      const existingPhone = await this.prisma.phone.findFirst({
        where: { contactId, isPrimary: true },
      });
      if (existingPhone) {
        await this.prisma.phone.update({
          where: { id: existingPhone.id },
          data: { value: phone },
        });
      } else if (phone) {
        await this.prisma.phone.create({
          data: {
            contactId,
            value: phone,
            isPrimary: true,
            category: 'Mobile',
          },
        });
      }
    }
    return this.getFullProfile(contactId);
  }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate(
  [
    (0, common_1.Injectable)(),
    __metadata('design:paramtypes', [
      users_service_1.UsersService,
      jwt_helpers_service_1.JwtHelperService,
      jwt_1.JwtService,
      prisma_service_1.PrismaService,
    ]),
  ],
  AuthService,
);
//# sourceMappingURL=auth.service.js.map
