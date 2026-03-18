import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { Gender } from '../../crm/enums/gender';
import { CivilStatus } from '../../crm/enums/civilStatus';
import { roleAdmin } from '../../auth/constants';

// These are the TypeORM-based users (admin + instructors) seeded on first boot.
// Students log in via Prisma user records (seeded by prisma/seed.ts).
export const seedUsers: RegisterUserDto[] = [
  {
    firstName: 'Elevate',
    lastName: 'Admin',
    middleName: null,
    gender: Gender.Male,
    civilStatus: CivilStatus.Single,
    dateOfBirth: new Date('1990-01-01'),
    phone: '0700000001',
    email: 'admin@era92elevate.org',
    password: 'elevate2024',
    roles: [roleAdmin.role],
  },
  {
    firstName: 'John',
    lastName: 'Mukasa',
    middleName: null,
    gender: Gender.Male,
    civilStatus: CivilStatus.Single,
    dateOfBirth: new Date('1985-05-15'),
    phone: '0700000002',
    email: 'instructor@era92elevate.org',
    password: 'elevate2024',
    roles: [roleAdmin.role],
  },
];
