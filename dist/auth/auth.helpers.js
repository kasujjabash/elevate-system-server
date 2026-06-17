'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createUserDto = exports.cleanUpUser = void 0;
const crm_helpers_1 = require('../crm/crm.helpers');
const cleanUpUser = (user) => {
  delete user['password'];
};
exports.cleanUpUser = cleanUpUser;
const createUserDto = (user) => {
  const fromUserRoles = user.userRoles?.length
    ? user.userRoles.map((ur) => ur.roles?.role).filter(Boolean)
    : [];
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
    fullName: (0, crm_helpers_1.getPersonFullName)(user.contact.person),
    id: user.id,
    roles: roleNames,
    permissions: [],
    isActive: user.isActive,
  };
};
exports.createUserDto = createUserDto;
//# sourceMappingURL=auth.helpers.js.map
