'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.seedUsers = void 0;
const gender_1 = require('../../crm/enums/gender');
const civilStatus_1 = require('../../crm/enums/civilStatus');
const constants_1 = require('../../auth/constants');
exports.seedUsers = [
  {
    firstName: 'Elevate',
    lastName: 'Admin',
    middleName: null,
    gender: gender_1.Gender.Male,
    civilStatus: civilStatus_1.CivilStatus.Single,
    dateOfBirth: new Date('1990-01-01'),
    phone: '0700000001',
    email: 'admin@era92elevate.org',
    password: 'elevate2024',
    roles: [constants_1.roleAdmin.role],
  },
  {
    firstName: 'John',
    lastName: 'Mukasa',
    middleName: null,
    gender: gender_1.Gender.Male,
    civilStatus: civilStatus_1.CivilStatus.Single,
    dateOfBirth: new Date('1985-05-15'),
    phone: '0700000002',
    email: 'instructor@era92elevate.org',
    password: 'elevate2024',
    roles: [constants_1.roleAdmin.role],
  },
];
//# sourceMappingURL=users.js.map
