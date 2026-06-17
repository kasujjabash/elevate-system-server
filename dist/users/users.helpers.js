'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.usersEntities = void 0;
const user_entity_1 = require('./entities/user.entity');
const roles_entity_1 = require('./entities/roles.entity');
const userRoles_entity_1 = require('./entities/userRoles.entity');
exports.usersEntities = [
  user_entity_1.User,
  userRoles_entity_1.default,
  roles_entity_1.default,
];
//# sourceMappingURL=users.helpers.js.map
