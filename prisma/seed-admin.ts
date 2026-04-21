/**
 * Elevate Academy — TypeORM Admin User Seed
 * Creates the admin and instructor TypeORM users needed for login.
 * Run AFTER prisma/seed.ts and AFTER the server has started at least once
 * (so TypeORM synchronize creates the tables).
 *
 * Usage: npx ts-node -r tsconfig-paths/register prisma/seed-admin.ts
 */

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

  // Support both DATABASE_URL (Render/Railway) and individual DB_* vars (local)
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

    // Create RoleAdmin role
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
      console.log('  ✓ Role: RoleAdmin');
    }

    // Create RoleTrainer role
    let trainerRole = await rolesRepo.findOne({
      where: { role: 'TRAINER' },
    });
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
      console.log('  ✓ Role: RoleTrainer');
    }

    // Create HUB_MANAGER role
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
      console.log('  ✓ Role: RoleHubManager');
    }

    const users = [
      {
        firstName: 'Elevate',
        lastName: 'Admin',
        email: 'admin@era92elevate.org',
        password: 'elevate2024',
        role: adminRole,
      },
      {
        firstName: 'John',
        lastName: 'Mukasa',
        email: 'instructor@era92elevate.org',
        password: 'elevate2024',
        role: adminRole,
      },
      {
        firstName: 'Alice',
        lastName: 'Trainer',
        email: 'trainer@era92elevate.org',
        password: 'elevate2024',
        role: trainerRole,
      },
      // Hub Managers
      {
        firstName: 'Robert',
        lastName: 'Kizza',
        email: 'robert.kizza@hub.elevate.org',
        password: 'hubmanager2024',
        role: hubManagerRole,
      },
      {
        firstName: 'Annet',
        lastName: 'Nabukenya',
        email: 'annet.nabukenya@hub.elevate.org',
        password: 'hubmanager2024',
        role: hubManagerRole,
      },
      {
        firstName: 'Isaac',
        lastName: 'Opio',
        email: 'isaac.opio@hub.elevate.org',
        password: 'hubmanager2024',
        role: hubManagerRole,
      },
    ];

    const contactRepo = connection.getRepository('Contact');
    const personRepo = connection.getRepository('Person');
    const emailRepo = connection.getRepository('Email');
    const userRepo = connection.getRepository('User');
    const userRolesRepo = connection.getRepository('UserRoles');

    for (const u of users) {
      let user = await userRepo.findOne({
        where: { username: u.email },
        relations: ['userRoles', 'userRoles.roles'],
      });

      if (user) {
        // User exists - check if they have the correct role
        const hasRole = user.userRoles?.some(
          (ur) => ur.roles?.role === u.role.role,
        );
        if (hasRole) {
          console.log(`  ✓ User exists with role: ${u.email} (${u.role.role})`);
          continue;
        } else {
          // User exists but doesn't have the role - assign it
          const userRole = userRolesRepo.create({ user: user, roles: u.role });
          await userRolesRepo.save(userRole);
          console.log(
            `  ✓ Role assigned to existing user: ${u.email} (${u.role.role})`,
          );
          continue;
        }
      }

      // User doesn't exist - create them
      const contact = contactRepo.create({ category: 'Person', tenant });
      const savedContact = await contactRepo.save(contact);

      const person = personRepo.create({
        firstName: u.firstName,
        lastName: u.lastName,
        gender: 'Male',
        contactId: savedContact.id,
      });
      await personRepo.save(person);

      const email = emailRepo.create({
        value: u.email,
        category: 'Work',
        isPrimary: true,
        contact: savedContact,
      });
      await emailRepo.save(email);

      const hashedPassword = bcrypt.hashSync(u.password, HASH_ROUNDS);
      user = userRepo.create({
        username: u.email,
        password: hashedPassword,
        contactId: savedContact.id,
        isActive: true,
        roles: u.role.role,
        tenant,
      });
      const savedUser = await userRepo.save(user);

      const userRole = userRolesRepo.create({ user: savedUser, roles: u.role });
      await userRolesRepo.save(userRole);

      console.log(`  ✓ User: ${u.email} / ${u.password} (${u.role.role})`);
    }

    console.log('\n✅ Admin seed complete!');
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   admin@era92elevate.org      / elevate2024  (RoleAdmin)');
    console.log('   instructor@era92elevate.org / elevate2024  (RoleAdmin)');
    console.log('   trainer@era92elevate.org    / elevate2024  (RoleTrainer)');
    console.log('\n🏢 HUB MANAGER CREDENTIALS:');
    console.log(
      '   robert.kizza@hub.elevate.org     / hubmanager2024 (RoleHubManager)',
    );
    console.log(
      '   annet.nabukenya@hub.elevate.org  / hubmanager2024 (RoleHubManager)',
    );
    console.log(
      '   isaac.opio@hub.elevate.org       / hubmanager2024 (RoleHubManager)',
    );
  } finally {
    await connection.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
