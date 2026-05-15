/**
 * Elevate Academy — Prisma Seed
 * Run: npx ts-node -r tsconfig-paths/register prisma/seed.ts
 *
 * Creates:
 *  - 5 hubs
 *  - 4 skill categories: Graphic Design, Website Development, Film & Photography, UI/UX Design
 *  - 2 instructors
 *  - 10 students across different hubs/courses
 *  - Enrollments linking students to courses
 *  - Prisma user accounts for all (for future student-portal login)
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const HASH_ROUNDS = 10;

async function main() {
  console.log('🌱 Seeding Elevate Academy database...');

  // ── 1. HUBS ─────────────────────────────────────────────────────────────────
  const hubsData = [
    {
      name: 'Katanga Hub',
      code: 'katanga',
      location: 'Katanga, Kampala',
      address: 'Katanga Zone, Kampala',
    },
    {
      name: 'Kosovo Hub',
      code: 'kosovo',
      location: 'Kosovo, Kampala',
      address: 'Kosovo Zone, Kampala',
    },
    {
      name: 'Jinja Hub',
      code: 'jinja',
      location: 'Jinja Town',
      address: 'Main Street, Jinja',
    },
    {
      name: 'Namayemba Hub',
      code: 'namayemba',
      location: 'Namayemba',
      address: 'Namayemba, Mukono',
    },
    {
      name: 'Lyantode Hub',
      code: 'lyantode',
      location: 'Lyantode',
      address: 'Lyantode, Mpigi',
    },
  ];

  const hubs: Record<string, any> = {};
  for (const h of hubsData) {
    hubs[h.code] = await prisma.hub.upsert({
      where: { code: h.code },
      update: {},
      create: h,
    });
    console.log(`  ✓ Hub: ${h.name}`);
  }

  // ── 2. SKILL CATEGORIES (= course types) ────────────────────────────────────
  const categoriesData = [
    {
      id: 'graphic-design',
      name: 'Graphic Design',
      description: 'Visual design using tools like Photoshop and Illustrator',
    },
    {
      id: 'website-development',
      name: 'Website Development',
      description: 'HTML, CSS, JavaScript and modern web frameworks',
    },
    {
      id: 'film-photography',
      name: 'Film & Photography',
      description: 'Filmmaking, video editing and photography techniques',
    },
    {
      id: 'ui-ux-design',
      name: 'UI/UX Design',
      description: 'User interface and user experience design principles',
    },
  ];

  for (const cat of categoriesData) {
    await prisma.skill_category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // ── 3. INSTRUCTORS ───────────────────────────────────────────────────────────
  const instructorContacts = [
    {
      firstName: 'John',
      lastName: 'Mukasa',
      gender: 'Male' as const,
      email: 'john.mukasa@era92elevate.org',
      phone: '0701000001',
      employeeId: 'INS-001',
      hubCode: 'katanga',
      specialization: 'Website Development',
    },
    {
      firstName: 'Sarah',
      lastName: 'Namutebi',
      gender: 'Female' as const,
      email: 'sarah.namutebi@era92elevate.org',
      phone: '0701000002',
      employeeId: 'INS-002',
      hubCode: 'kosovo',
      specialization: 'Graphic Design',
    },
  ];

  const instructors: Record<string, any> = {};
  for (const inst of instructorContacts) {
    const existing = await prisma.instructor.findUnique({
      where: { employeeId: inst.employeeId },
    });
    if (!existing) {
      const contact = await prisma.contact.create({
        data: { category: 'Person' },
      });
      await prisma.person.create({
        data: {
          firstName: inst.firstName,
          lastName: inst.lastName,
          gender: inst.gender,
          contactId: contact.id,
        },
      });
      await prisma.email.create({
        data: {
          value: inst.email,
          category: 'Work',
          isPrimary: true,
          contactId: contact.id,
        },
      });
      await prisma.phone.create({
        data: {
          value: inst.phone,
          category: 'Mobile',
          isPrimary: true,
          contactId: contact.id,
        },
      });
      const instructor = await prisma.instructor.create({
        data: {
          employeeId: inst.employeeId,
          contactId: contact.id,
          hubId: hubs[inst.hubCode].id,
          specialization: inst.specialization,
          isActive: true,
        },
      });
      instructors[inst.employeeId] = instructor;
      console.log(`  ✓ Instructor: ${inst.firstName} ${inst.lastName}`);
    } else {
      instructors[inst.employeeId] = existing;
    }
  }

  // ── 4. COURSES ───────────────────────────────────────────────────────────────
  const coursesData = [
    {
      title: 'Website Development',
      skillCategoryId: 'website-development',
      hubCode: 'katanga',
      instructorId: instructors['INS-001']?.id,
      maxStudents: 30,
    },
    {
      title: 'Graphic Design',
      skillCategoryId: 'graphic-design',
      hubCode: 'kosovo',
      instructorId: instructors['INS-002']?.id,
      maxStudents: 25,
    },
    {
      title: 'Film & Photography',
      skillCategoryId: 'film-photography',
      hubCode: 'jinja',
      instructorId: instructors['INS-001']?.id,
      maxStudents: 20,
    },
    {
      title: 'UI/UX Design',
      skillCategoryId: 'ui-ux-design',
      hubCode: 'namayemba',
      instructorId: instructors['INS-002']?.id,
      maxStudents: 25,
    },
  ];

  const courseMap: any[] = [];
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: {
        title_hubId: {
          title: c.title,
          hubId: hubs[c.hubCode].id,
        },
      },
      update: {},
      create: {
        title: c.title,
        description: `${c.title} course at ${hubs[c.hubCode].name}`,
        skillCategoryId: c.skillCategoryId,
        hubId: hubs[c.hubCode].id,
        isActive: true,
        isEnrollable: true,
      },
    });
    courseMap.push({
      ...course,
      hubCode: c.hubCode,
      skillCategoryId: c.skillCategoryId,
    });
    console.log(`  ✓ Course: ${c.title} @ ${hubs[c.hubCode].name}`);
  }

  // ── 5. STUDENTS + USER ACCOUNTS ─────────────────────────────────────────────
  const studentsData = [
    // Katanga – Website Development
    {
      firstName: 'Jane',
      lastName: 'Nakato',
      gender: 'Female' as const,
      email: 'jane.nakato@student.elevate.org',
      phone: '0772100001',
      hubCode: 'katanga',
      course: 'website-development',
      password: 'student2024',
    },
    {
      firstName: 'Brian',
      lastName: 'Ssekandi',
      gender: 'Male' as const,
      email: 'brian.ssekandi@student.elevate.org',
      phone: '0772100002',
      hubCode: 'katanga',
      course: 'website-development',
      password: 'student2024',
    },
    {
      firstName: 'Mercy',
      lastName: 'Apio',
      gender: 'Female' as const,
      email: 'mercy.apio@student.elevate.org',
      phone: '0772100003',
      hubCode: 'katanga',
      course: 'graphic-design',
      password: 'student2024',
    },
    // Kosovo – Graphic Design
    {
      firstName: 'David',
      lastName: 'Okello',
      gender: 'Male' as const,
      email: 'david.okello@student.elevate.org',
      phone: '0772100004',
      hubCode: 'kosovo',
      course: 'graphic-design',
      password: 'student2024',
    },
    {
      firstName: 'Grace',
      lastName: 'Namugga',
      gender: 'Female' as const,
      email: 'grace.namugga@student.elevate.org',
      phone: '0772100005',
      hubCode: 'kosovo',
      course: 'graphic-design',
      password: 'student2024',
    },
    // Jinja – Film & Photography
    {
      firstName: 'Peter',
      lastName: 'Mugisha',
      gender: 'Male' as const,
      email: 'peter.mugisha@student.elevate.org',
      phone: '0772100006',
      hubCode: 'jinja',
      course: 'film-photography',
      password: 'student2024',
    },
    {
      firstName: 'Annet',
      lastName: 'Akello',
      gender: 'Female' as const,
      email: 'annet.akello@student.elevate.org',
      phone: '0772100007',
      hubCode: 'jinja',
      course: 'film-photography',
      password: 'student2024',
    },
    // Namayemba – UI/UX Design
    {
      firstName: 'Moses',
      lastName: 'Waiswa',
      gender: 'Male' as const,
      email: 'moses.waiswa@student.elevate.org',
      phone: '0772100008',
      hubCode: 'namayemba',
      course: 'ui-ux-design',
      password: 'student2024',
    },
    // Lyantode – UI/UX Design
    {
      firstName: 'Esther',
      lastName: 'Nanyanzi',
      gender: 'Female' as const,
      email: 'esther.nanyanzi@student.elevate.org',
      phone: '0772100009',
      hubCode: 'lyantode',
      course: 'ui-ux-design',
      password: 'student2024',
    },
    {
      firstName: 'Samuel',
      lastName: 'Kato',
      gender: 'Male' as const,
      email: 'samuel.kato@student.elevate.org',
      phone: '0772100010',
      hubCode: 'lyantode',
      course: 'film-photography',
      password: 'student2024',
    },
  ];

  let studentCount = await prisma.student.count();

  for (const s of studentsData) {
    const existingEmail = await prisma.email.findFirst({
      where: { value: s.email },
    });
    if (existingEmail) {
      console.log(`  ⚠️  Student exists: ${s.firstName} ${s.lastName}`);
      continue;
    }

    studentCount++;
    const studentId = `EA${String(studentCount).padStart(6, '0')}`;

    // Create Prisma contact + person + email + phone + student
    const contact = await prisma.contact.create({
      data: { category: 'Person' },
    });
    await prisma.person.create({
      data: {
        firstName: s.firstName,
        lastName: s.lastName,
        gender: s.gender,
        contactId: contact.id,
      },
    });
    await prisma.email.create({
      data: {
        value: s.email,
        category: 'School',
        isPrimary: true,
        contactId: contact.id,
      },
    });
    await prisma.phone.create({
      data: {
        value: s.phone,
        category: 'Mobile',
        isPrimary: true,
        contactId: contact.id,
      },
    });

    const student = await prisma.student.create({
      data: {
        studentId,
        contactId: contact.id,
        hubId: hubs[s.hubCode].id,
        status: 'Active',
      },
    });

    // Find matching course
    const course =
      courseMap.find(
        (c) => c.skillCategoryId === s.course && c.hubCode === s.hubCode,
      ) || courseMap.find((c) => c.skillCategoryId === s.course);

    if (course) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          status: 'Enrolled',
          progress: Math.floor(Math.random() * 60),
        },
      });
    }

    // Create Prisma user account for student login
    const hashedPassword = await bcrypt.hash(s.password, HASH_ROUNDS);
    await prisma.user.upsert({
      where: { username: s.email },
      update: { roles: 'STUDENT', isActive: true },
      create: {
        username: s.email,
        password: hashedPassword,
        contactId: contact.id,
        roles: 'STUDENT',
        isActive: true,
      },
    });

    console.log(
      `  ✓ Student ${studentId}: ${s.firstName} ${s.lastName} (${s.hubCode} / ${s.course})`,
    );
  }

  // ── 6. DEMO TEST STUDENTS (easy-to-remember accounts for testing) ────────────
  const demoStudents = [
    {
      firstName: 'Demo',
      lastName: 'WebDev',
      gender: 'Male' as const,
      email: 'webdev.student@era92elevate.org',
      phone: '0772200001',
      hubCode: 'katanga',
      course: 'website-development',
      password: 'student2024',
    },
    {
      firstName: 'Demo',
      lastName: 'Designer',
      gender: 'Female' as const,
      email: 'design.student@era92elevate.org',
      phone: '0772200002',
      hubCode: 'kosovo',
      course: 'graphic-design',
      password: 'student2024',
    },
  ];

  for (const s of demoStudents) {
    const existingEmail = await prisma.email.findFirst({
      where: { value: s.email },
    });
    if (existingEmail) {
      console.log(`  ⚠️  Demo student exists: ${s.email}`);
      continue;
    }

    studentCount++;
    const studentId = `EA${String(studentCount).padStart(6, '0')}`;
    const contact = await prisma.contact.create({
      data: { category: 'Person' },
    });
    await prisma.person.create({
      data: {
        firstName: s.firstName,
        lastName: s.lastName,
        gender: s.gender,
        contactId: contact.id,
      },
    });
    await prisma.email.create({
      data: {
        value: s.email,
        category: 'School',
        isPrimary: true,
        contactId: contact.id,
      },
    });
    await prisma.phone.create({
      data: {
        value: s.phone,
        category: 'Mobile',
        isPrimary: true,
        contactId: contact.id,
      },
    });

    const student = await prisma.student.create({
      data: {
        studentId,
        contactId: contact.id,
        hubId: hubs[s.hubCode].id,
        status: 'Active',
      },
    });

    const course =
      courseMap.find(
        (c) => c.skillCategoryId === s.course && c.hubCode === s.hubCode,
      ) || courseMap.find((c) => c.skillCategoryId === s.course);

    if (course) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          status: 'Enrolled',
          progress: 0,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(s.password, HASH_ROUNDS);
    await prisma.user.upsert({
      where: { username: s.email },
      update: { roles: 'STUDENT', isActive: true },
      create: {
        username: s.email,
        password: hashedPassword,
        contactId: contact.id,
        roles: 'STUDENT',
        isActive: true,
      },
    });

    console.log(
      `  ✓ Demo student ${studentId}: ${s.email} → ${s.course} @ ${s.hubCode}`,
    );
  }

  // ── 7. DEFAULT STUDENT (from SERVER_API.md) ──────────────────────────────────
  const defaultStudent = await prisma.email.findFirst({
    where: { value: 'student@era92elevate.org' },
  });
  if (!defaultStudent) {
    studentCount++;
    const contact = await prisma.contact.create({
      data: { category: 'Person' },
    });
    await prisma.person.create({
      data: {
        firstName: 'Test',
        lastName: 'Student',
        gender: 'Male',
        contactId: contact.id,
      },
    });
    await prisma.email.create({
      data: {
        value: 'student@era92elevate.org',
        category: 'School',
        isPrimary: true,
        contactId: contact.id,
      },
    });
    const student = await prisma.student.create({
      data: {
        studentId: `EA${String(studentCount).padStart(6, '0')}`,
        contactId: contact.id,
        hubId: hubs['katanga'].id,
        status: 'Active',
      },
    });
    const webDevCourse = courseMap.find(
      (c) =>
        c.skillCategoryId === 'website-development' && c.hubCode === 'katanga',
    );
    if (webDevCourse) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: webDevCourse.id,
          status: 'Enrolled',
          progress: 0,
        },
      });
    }
    const hashedPassword = await bcrypt.hash('student2024', HASH_ROUNDS);
    await prisma.user.upsert({
      where: { username: 'student@era92elevate.org' },
      update: { roles: 'STUDENT', isActive: true },
      create: {
        username: 'student@era92elevate.org',
        password: hashedPassword,
        contactId: contact.id,
        roles: 'STUDENT',
        isActive: true,
      },
    });
    console.log('  ✓ Default student: student@era92elevate.org / student2024');
  } else {
    // Ensure existing default student has roles set
    await prisma.user.updateMany({
      where: { username: 'student@era92elevate.org' },
      data: { roles: 'STUDENT', isActive: true },
    });
    console.log('  ✓ Default student roles updated: student@era92elevate.org');
  }

  // ── 8. HUB MANAGERS ─────────────────────────────────────────────────────────
  const hubManagersData = [
    {
      firstName: 'Robert',
      lastName: 'Kizza',
      email: 'robert.kizza@hub.elevate.org',
      hubCode: 'katanga',
    },
    {
      firstName: 'Annet',
      lastName: 'Nabukenya',
      email: 'annet.nabukenya@hub.elevate.org',
      hubCode: 'kosovo',
    },
    {
      firstName: 'Isaac',
      lastName: 'Opio',
      email: 'isaac.opio@hub.elevate.org',
      hubCode: 'jinja',
    },
  ];
  const hmPassword = await bcrypt.hash('hubmanager2024', HASH_ROUNDS);
  for (const hm of hubManagersData) {
    const existingEmail = await prisma.email.findFirst({
      where: { value: hm.email },
    });
    let contactId: number;
    if (!existingEmail) {
      const contact = await prisma.contact.create({
        data: { category: 'Person' },
      });
      await prisma.person.create({
        data: {
          firstName: hm.firstName,
          lastName: hm.lastName,
          gender: 'Male',
          contactId: contact.id,
        },
      });
      await prisma.email.create({
        data: {
          value: hm.email,
          category: 'Work',
          isPrimary: true,
          contactId: contact.id,
        },
      });
      contactId = contact.id;
    } else {
      contactId = existingEmail.contactId;
    }
    await prisma.user.upsert({
      where: { username: hm.email },
      update: {
        roles: 'HUB_MANAGER',
        isActive: true,
        hubId: hubs[hm.hubCode].id,
      },
      create: {
        username: hm.email,
        password: hmPassword,
        contactId,
        roles: 'HUB_MANAGER',
        isActive: true,
        hubId: hubs[hm.hubCode].id,
      },
    });
    console.log(
      `  ✓ Hub Manager: ${hm.email} / hubmanager2024 (${hm.hubCode})`,
    );
  }

  // ── 9. TRAINERS ──────────────────────────────────────────────────────────────
  const trainersData = [
    {
      firstName: 'Daniel',
      lastName: 'Ochieng',
      email: 'daniel.ochieng@trainer.elevate.org',
      hubCode: 'katanga',
      specialization: 'Website Development',
    },
    {
      firstName: 'Grace',
      lastName: 'Akello',
      email: 'grace.akello@trainer.elevate.org',
      hubCode: 'kosovo',
      specialization: 'Graphic Design',
    },
    {
      firstName: 'Patrick',
      lastName: 'Ssali',
      email: 'patrick.ssali@trainer.elevate.org',
      hubCode: 'jinja',
      specialization: 'Film & Photography',
    },
    {
      firstName: 'Miriam',
      lastName: 'Atim',
      email: 'miriam.atim@trainer.elevate.org',
      hubCode: 'namayemba',
      specialization: 'UI/UX Design',
    },
    {
      firstName: 'Peter',
      lastName: 'Mwanje',
      email: 'peter.mwanje@trainer.elevate.org',
      hubCode: 'lyantode',
      specialization: 'Website Development',
    },
    {
      firstName: 'Nickolus',
      lastName: 'Onapa',
      email: 'nickolus.onapa@trainer.elevate.org',
      hubCode: 'katanga',
      specialization: 'Graphic Design',
    },
    {
      firstName: 'Andrew',
      lastName: 'Trainer',
      email: 'andrew@trainer.elevate.org',
      hubCode: 'kosovo',
      specialization: 'UI/UX Design',
    },
    {
      firstName: 'Mark',
      lastName: 'Omudigi',
      email: 'mark.omudigi@trainer.elevate.org',
      hubCode: 'jinja',
      specialization: 'Film & Photography',
    },
  ];
  const trainerPassword = await bcrypt.hash('trainer2024', HASH_ROUNDS);
  for (let idx = 0; idx < trainersData.length; idx++) {
    const t = trainersData[idx];
    const existingEmail = await prisma.email.findFirst({
      where: { value: t.email },
    });
    let contactId: number;
    if (!existingEmail) {
      const contact = await prisma.contact.create({
        data: { category: 'Person' },
      });
      await prisma.person.create({
        data: {
          firstName: t.firstName,
          lastName: t.lastName,
          gender: 'Male',
          contactId: contact.id,
        },
      });
      await prisma.email.create({
        data: {
          value: t.email,
          category: 'Work',
          isPrimary: true,
          contactId: contact.id,
        },
      });
      contactId = contact.id;
    } else {
      contactId = existingEmail.contactId;
    }
    await prisma.user.upsert({
      where: { username: t.email },
      update: { roles: 'TRAINER', isActive: true, password: trainerPassword },
      create: {
        username: t.email,
        password: trainerPassword,
        contactId,
        roles: 'TRAINER',
        isActive: true,
      },
    });
    await prisma.instructor.upsert({
      where: { contactId },
      update: {
        hubId: hubs[t.hubCode].id,
        specialization: t.specialization,
        isActive: true,
      },
      create: {
        contactId,
        employeeId: `TRN-${String(idx + 1).padStart(3, '0')}`,
        hubId: hubs[t.hubCode].id,
        specialization: t.specialization,
        isActive: true,
      },
    });
    console.log(`  ✓ Trainer: ${t.email} / trainer2024`);
  }

  // Ensure all roles are correctly set
  await prisma.$executeRaw`UPDATE "user" SET roles = 'STUDENT' WHERE id IN (SELECT u.id FROM "user" u JOIN student s ON s."contactId" = u."contactId" WHERE u.roles IS NULL OR u.roles = '')`;
  await prisma.$executeRaw`UPDATE "user" SET roles = 'TRAINER' WHERE id IN (SELECT u.id FROM "user" u JOIN instructor i ON i."contactId" = u."contactId" WHERE u.roles IS NULL OR u.roles = '')`;

  console.log('\n✅ Prisma seed complete!');
  console.log('\n📋 STUDENT LOGINS:');
  console.log('   Email pattern: firstname.lastname@student.elevate.org');
  console.log('   Password: student2024');
  console.log('   Default: student@era92elevate.org / student2024');
  console.log(
    '\n⚠️  Admin/instructor TypeORM logins are seeded separately via the NestJS seed service.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
