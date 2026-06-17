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
const openapi = require('@nestjs/swagger');
const typeorm_1 = require('typeorm');
const roles_entity_1 = require('./roles.entity');
const user_entity_1 = require('./user.entity');
let UserRoles = class UserRoles {
  static _OPENAPI_METADATA_FACTORY() {
    return {
      id: { required: true, type: () => Number },
      user: { required: true, type: () => require('./user.entity').User },
      userId: { required: true, type: () => Number },
      roles: { required: true, type: () => require('./roles.entity').default },
      rolesId: { required: true, type: () => Number },
    };
  }
};
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  UserRoles.prototype,
  'id',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      (type) => user_entity_1.User,
      (it) => it.userRoles,
      { onDelete: 'CASCADE' },
    ),
    __metadata('design:type', user_entity_1.User),
  ],
  UserRoles.prototype,
  'user',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  UserRoles.prototype,
  'userId',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      (type) => roles_entity_1.default,
      (it) => it.rolesUser,
      { onDelete: 'CASCADE' },
    ),
    __metadata('design:type', roles_entity_1.default),
  ],
  UserRoles.prototype,
  'roles',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)(), __metadata('design:type', Number)],
  UserRoles.prototype,
  'rolesId',
  void 0,
);
UserRoles = __decorate(
  [(0, typeorm_1.Entity)(), (0, typeorm_1.Unique)(['userId', 'rolesId'])],
  UserRoles,
);
exports.default = UserRoles;
//# sourceMappingURL=userRoles.entity.js.map
