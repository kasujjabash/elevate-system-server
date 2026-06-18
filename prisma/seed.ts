import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Elevate Academy database...');

  // ── 1. HUBS ─────────────────────────────────────────────────────────────────
  await prisma.$executeRaw`UPDATE hub SET code = UPPER(code) WHERE code != UPPER(code)`;

  const hubsData = [
    {
      name: 'Katanga Hub',
      code: 'KATANGA',
      location: 'Katanga, Kampala',
      address: 'Katanga Zone, Kampala',
    },
    {
      name: 'Kosovo Hub',
      code: 'KOSOVO',
      location: 'Kosovo, Kampala',
      address: 'Kosovo Zone, Kampala',
    },
    {
      name: 'Jinja Hub',
      code: 'JINJA',
      location: 'Jinja Town',
      address: 'Main Street, Jinja',
    },
    {
      name: 'Namayemba Hub',
      code: 'NAMAYEMBA',
      location: 'Namayemba',
      address: 'Namayemba, Mukono',
    },
    {
      name: 'Lyantode Hub',
      code: 'LYANTODE',
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

  // ── 2. SKILL CATEGORIES ─────────────────────────────────────────────────────
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

  // ── 3. COURSES ───────────────────────────────────────────────────────────────
  const coursesData = [
    {
      title: 'Website Development',
      skillCategoryId: 'website-development',
      hubCode: 'KATANGA',
      maxStudents: 30,
    },
    {
      title: 'Graphic Design',
      skillCategoryId: 'graphic-design',
      hubCode: 'KOSOVO',
      maxStudents: 25,
    },
    {
      title: 'Film & Photography',
      skillCategoryId: 'film-photography',
      hubCode: 'JINJA',
      maxStudents: 20,
    },
    {
      title: 'UI/UX Design',
      skillCategoryId: 'ui-ux-design',
      hubCode: 'NAMAYEMBA',
      maxStudents: 25,
    },
  ];

  for (const c of coursesData) {
    await prisma.course.upsert({
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
    console.log(`  ✓ Course: ${c.title} @ ${hubs[c.hubCode].name}`);
  }

  console.log('\n✅ Prisma seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
