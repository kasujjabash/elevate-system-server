import { User } from '../users/entities/user.entity';
import { UserDto } from './dto/user.dto';
import { getPersonFullName } from '../crm/crm.helpers';

export const cleanUpUser = (user: User) => {
  delete user['password'];
};

export const createUserDto = (user: User): UserDto => {
  // Try userRoles join table first (authoritative for staff)
  const fromUserRoles = user.userRoles?.length
    ? user.userRoles.map((ur) => ur.roles?.role).filter(Boolean)
    : [];

  // Fall back to legacy roles string column if userRoles gives nothing
  const roleNames =
    fromUserRoles.length > 0
      ? fromUserRoles
      : user.roles
      ? user.roles
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean)
      : [];

  return {
    contactId: user.contact.id,
    email: user.username,
    username: user.username,
    fullName: getPersonFullName(user.contact.person),
    id: user.id,
    roles: roleNames,
    permissions: [],
    isActive: user.isActive,
  };
};
