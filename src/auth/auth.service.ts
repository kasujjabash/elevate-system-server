import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { cleanUpUser, createUserDto } from './auth.helpers';
import { UserDto } from './dto/user.dto';
import { IEmail, sendEmail } from 'src/utils/mailer';
import { ForgotPasswordResponseDto } from './dto/forgot-password-response.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtHelperService } from './jwt-helpers.service';
import { UserListDto } from 'src/users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  HierarchyDto,
} from './dto/login-response.dto';
import {
  roleAdmin,
  roleSuperAdmin,
  roleHubManager,
  roleTrainer,
  roleStudent,
} from './constants';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtHelperService: JwtHelperService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
    hub?: string,
  ): Promise<UserDto | null> {
    const user = await this.usersService.findByName(username);
    if (!user) {
      Logger.warn('Invalid username:', username);
      return null;
    }
    if (!user.isActive) {
      Logger.warn('User inactive:', username);
      return null;
    }

    const valid = await user.validatePassword(pass);
    if (!valid) {
      Logger.warn('Invalid password for:', username);
      return null;
    }

    cleanUpUser(user);
    const dto = createUserDto(user);
    dto.permissions = await this.getPermissions(dto.roles);
    return dto;
  }

  async generateToken(
    user: UserDto | UserListDto,
    tenant: string,
  ): Promise<LoginResponseDto> {
    const userPermissions = await this.getPermissions(user.roles);
    user.permissions = userPermissions;

    // Fetch hubId from DB so hub managers get it in their JWT
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { hubId: true },
    });

    const payload = {
      ...user,
      sub: user.id,
      aud: tenant,
      permissions: userPermissions,
      hubId: dbUser?.hubId ?? null,
    };
    const token = await this.jwtService.signAsync(payload);
    const hierarchy = await this.getUserHierarchy(user.id);
    return { token, user, hierarchy };
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async forgotPassword(username: string): Promise<ForgotPasswordResponseDto> {
    const userExists = await this.usersService.findByName(username);
    const message =
      'An email has been sent to the provided address if it exists in our system';
    if (!userExists) {
      Logger.error('Provided email address not registered');
      return { token: '', mailURL: '', message };
    }

    const user = await this.usersService.findOne(userExists.id);
    const token = (await this.jwtHelperService.generateToken(user)).token;
    const resetLink = `${process.env.APP_URL}/#/reset-password/${token}`;

    const mailerData: IEmail = {
      to: userExists.username,
      subject: 'Elevate Academy - Reset Password',
      html: `<p>Here is a link to reset your password!</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 10 minutes.</p>`,
    };
    const mailURL = await sendEmail(mailerData);
    return { token, mailURL, user };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ResetPasswordResponseDto> {
    const decodedToken = await this.jwtHelperService.decodeToken(token);
    if (!decodedToken)
      throw new HttpException('Incorrect Token, User not retrieved', 404);

    const userFromDb = await this.usersService.findOne(decodedToken.id);
    const data: UpdateUserDto = {
      id: decodedToken.id,
      password: newPassword,
      roles: userFromDb.roles,
      isActive: userFromDb.isActive,
    };
    const user = await this.usersService.update(data);
    if (!user) throw new HttpException('User Password Not Updated', 404);

    const mailerData: IEmail = {
      to: (await user).username,
      subject: 'Password Change Confirmation',
      html: `<h3>Hello ${
        (await user).fullName
      },</h3><p>Your password has been changed successfully!</p>`,
    };
    const mailURL = await sendEmail(mailerData);
    return { message: 'Password Change Successful', mailURL, user };
  }

  async getPermissions(roles: string[]): Promise<string[]> {
    const allRoleConfigs = [
      roleSuperAdmin,
      roleAdmin,
      roleHubManager,
      roleTrainer,
      roleStudent,
    ];
    const permissions: string[] = [];
    for (const roleName of roles) {
      const found = allRoleConfigs.find(
        (r) => r.role.toLowerCase() === roleName.toLowerCase(),
      );
      if (found) permissions.push(...found.permissions);
    }
    return [...new Set(permissions)];
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    return {
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }

  async getUserHierarchy(_userId: number): Promise<HierarchyDto> {
    return { myGroups: [] };
  }

  async getFullProfile(contactId: number) {
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

  async updateProfile(
    contactId: number,
    dto: { firstName?: string; lastName?: string; phone?: string },
  ) {
    const { firstName, lastName, phone } = dto;

    // Update person name
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

    // Update or create primary phone
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
}
