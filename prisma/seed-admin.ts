import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const HASH_ROUNDS = 10;

async function main() {
  console.log('🔐 Seeding admin TypeORM users...');
  console.log('   DB:', process.env.DB_DATABASE || 'from DATABASE_URL');
  console.log(
    '   DATABASE_URL:',
    process.env.DATABASE_URL ? 'present' : 'not set',
  );

  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  const connectionConfig = databaseUrl
    ? {
        type: 'postgres' as const,
        url: databaseUrl,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        synchronize: true,
        logging: false,
        entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
      }
    : {
        type: 'postgres' as const,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'macbookpro',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'elevate-academy-db',
        synchronize: true,
        logging: false,
        ssl:
          process.env.DB_HOST !== 'localhost'
            ? { rejectUnauthorized: false }
            : false,
        entities: [path.join(__dirname, '../src/**/*.entity{.ts,.js}')],
      };

  console.log(
    '   Connection method:',
    databaseUrl ? 'DATABASE_URL' : 'individual vars',
  );

  const connection = new DataSource(connectionConfig);
  await connection.initialize();

  try {
    // Create default tenant
    const tenantRepo = connection.getRepository('Tenant');
    let tenant = await tenantRepo.findOne({ where: { name: 'elevate' } });
    if (!tenant) {
      tenant = tenantRepo.create({
        id: 1,
        name: 'elevate',
        description: 'Elevate Academy',
      });
      tenant = await tenantRepo.save(tenant);
      console.log('  ✓ Tenant: elevate');
    }

    // Roles
    const rolesRepo = connection.getRepository('Roles');

    let adminRole = await rolesRepo.findOne({ where: { role: 'ADMIN' } });
    if (!adminRole) {
      adminRole = rolesRepo.create({
        role: 'ADMIN',
        description: 'System Administrator',
        permissions: [
          'DASHBOARD',
          'STUDENT_VIEW',
          'STUDENT_EDIT',
          'USER_VIEW',
          'USER_EDIT',
          'ROLE_EDIT',
          'COURSE_VIEW',
          'COURSE_EDIT',
          'CLASS_VIEW',
          'CLASS_EDIT',
          'HUB_VIEW',
          'HUB_EDIT',
          'REPORT_VIEW',
          'REPORT_VIEW_SUBMISSIONS',
          'TAG_VIEW',
          'TAG_EDIT',
          'MANAGE_HELP',
        ],
        isActive: true,
        tenant,
      });
      adminRole = await rolesRepo.save(adminRole);
      console.log('  ✓ Role: ADMIN');
    }

    let trainerRole = await rolesRepo.findOne({ where: { role: 'TRAINER' } });
    if (!trainerRole) {
      trainerRole = rolesRepo.create({
        role: 'TRAINER',
        description: 'Trainer / Instructor',
        permissions: [
          'DASHBOARD',
          'STUDENT_VIEW',
          'COURSE_VIEW',
          'COURSE_EDIT',
          'CLASS_VIEW',
          'CLASS_EDIT',
          'HUB_VIEW',
          'REPORT_VIEW',
          'REPORT_VIEW_SUBMISSIONS',
        ],
        isActive: true,
        tenant,
      });
      trainerRole = await rolesRepo.save(trainerRole);
      console.log('  ✓ Role: TRAINER');
    }

    let hubManagerRole = await rolesRepo.findOne({
      where: { role: 'HUB_MANAGER' },
    });
    if (!hubManagerRole) {
      hubManagerRole = rolesRepo.create({
        role: 'HUB_MANAGER',
        description: 'Hub Manager',
        permissions: [
          'DASHBOARD',
          'STUDENT_VIEW',
          'STUDENT_EDIT',
          'USER_VIEW',
          'USER_EDIT',
          'COURSE_VIEW',
          'COURSE_EDIT',
          'CLASS_VIEW',
          'CLASS_EDIT',
          'HUB_VIEW',
          'HUB_EDIT',
          'REPORT_VIEW',
          'REPORT_VIEW_SUBMISSIONS',
          'TAG_VIEW',
          'TAG_EDIT',
        ],
        isActive: true,
        tenant,
      });
      hubManagerRole = await rolesRepo.save(hubManagerRole);
      console.log('  ✓ Role: HUB_MANAGER');
    }

    // Admin account
    const contactRepo = connection.getRepository('Contact');
    const personRepo = connection.getRepository('Person');
    const emailRepo = connection.getRepository('Email');
    const userRepo = connection.getRepository('User');
    const userRolesRepo = connection.getRepository('UserRoles');

    const adminUser = await userRepo.findOne({
      where: { username: 'admin@era92elevate.org' },
      relations: ['userRoles', 'userRoles.roles'],
    });

    if (adminUser) {
      const hasRole = adminUser.userRoles?.some(
        (ur) => ur.roles?.role === 'ADMIN',
      );
      if (!hasRole) {
        const userRole = userRolesRepo.create({
          user: adminUser,
          roles: adminRole,
        });
        await userRolesRepo.save(userRole);
      }
      console.log('  ✓ Admin: admin@era92elevate.org (exists)');
    } else {
      const contact = contactRepo.create({ category: 'Person', tenant });
      const savedContact = await contactRepo.save(contact);

      await personRepo.save(
        personRepo.create({
          firstName: 'Elevate',
          lastName: 'Admin',
          gender: 'Male',
          contactId: savedContact.id,
        }),
      );

      await emailRepo.save(
        emailRepo.create({
          value: 'admin@era92elevate.org',
          category: 'Work',
          isPrimary: true,
          contact: savedContact,
        }),
      );

      const hashedPassword = bcrypt.hashSync('elevate2024', HASH_ROUNDS);
      const savedUser = await userRepo.save(
        userRepo.create({
          username: 'admin@era92elevate.org',
          password: hashedPassword,
          contactId: savedContact.id,
          isActive: true,
          roles: 'ADMIN',
          tenant,
        }),
      );

      await userRolesRepo.save(
        userRolesRepo.create({ user: savedUser, roles: adminRole }),
      );
      console.log('  ✓ Admin: admin@era92elevate.org / elevate2024');
    }

    console.log('\n✅ Admin seed complete!');
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   admin@era92elevate.org / elevate2024  (ADMIN)');
  } finally {
    await connection.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
