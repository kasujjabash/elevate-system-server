import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import Contact from '../src/crm/entities/contact.entity';
import Person from '../src/crm/entities/person.entity';
import Email from '../src/crm/entities/email.entity';
import { ContactCategory } from '../src/crm/enums/contactCategory';
import { EmailCategory } from '../src/crm/enums/emailCategory';
import { Gender } from '../src/crm/enums/gender';
import * as bcrypt from 'bcrypt';

async function createStudentUser() {
  const application = await NestFactory.createApplicationContext(AppModule);

  const prisma = application.get(PrismaService);
  const userRepository: Repository<User> = application.get(
    getRepositoryToken(User),
  );
  const contactRepository: Repository<Contact> = application.get(
    getRepositoryToken(Contact),
  );
  const personRepository: Repository<Person> = application.get(
    getRepositoryToken(Person),
  );
  const emailRepository: Repository<Email> = application.get(
    getRepositoryToken(Email),
  );

  // Get student from Prisma
  const student = await prisma.student.findFirst({
    where: {
      contact: {
        email: {
          some: {
            value: 'webdev.student@era92elevate.org',
          },
        },
      },
    },
    include: {
      contact: {
        include: {
          person: true,
          email: true,
        },
      },
    },
  });

  if (!student) {
    console.log('❌ Student not found in Prisma');
    process.exit(1);
  }

  // Check if user already exists in TypeORM
  const existingUser = await userRepository.findOne({
    where: { username: 'webdev.student@era92elevate.org' },
  });

  if (existingUser) {
    console.log('⚠️  User exists in TypeORM - fixing password hash...');
    const hashedPassword = await bcrypt.hash('student2024', 10);
    existingUser.password = hashedPassword;
    await userRepository.save(existingUser);
    console.log('✅ Fixed password hash for webdev.student@era92elevate.org');
    console.log('🔑 Login: webdev.student@era92elevate.org / student2024');
    await application.close();
    process.exit(0);
  }

  // Create TypeORM Contact
  const contact = contactRepository.create({
    category: ContactCategory.Person,
  });
  await contactRepository.save(contact);

  // Create TypeORM Person
  const person = personRepository.create({
    firstName: student.contact.person?.firstName || 'Demo',
    lastName: student.contact.person?.lastName || 'Student',
    gender: Gender.Male,
    contactId: contact.id,
  });
  await personRepository.save(person);

  // Create TypeORM Email
  const email = emailRepository.create({
    category: EmailCategory.Personal,
    value: 'webdev.student@era92elevate.org',
    isPrimary: true,
    contactId: contact.id,
  });
  await emailRepository.save(email);

  // Create TypeORM User
  const hashedPassword = await bcrypt.hash('student2024', 10);
  const user = userRepository.create({
    username: 'webdev.student@era92elevate.org',
    password: hashedPassword,
    isActive: true,
    contactId: contact.id,
  });
  await userRepository.save(user);

  console.log('✅ Created TypeORM User for webdev.student@era92elevate.org');
  console.log('🔑 Login: webdev.student@era92elevate.org / student2024');

  await application.close();
  process.exit(0);
}

createStudentUser().catch(console.error);
