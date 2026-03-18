# Database Seeding Guide — Elevate Academy

This guide explains how to seed your NestJS backend with realistic Elevate Academy data.

## Quick Start

```bash
# Seed all Elevate Academy data (hubs, courses, instructors, students)
npm run seed:elevate

# Seed admin + instructor TypeORM accounts
npm run seed:admin

# Clear existing data and re-seed
npm run seed:reset

# Clear data only
npm run seed:clear
```

## What Gets Seeded

### Hubs (5 locations)

| Code | Hub Name | Location |
|------|----------|----------|
| `katanga` | Katanga Hub | Katanga, Kampala |
| `kosovo` | Kosovo Hub | Kosovo, Kampala |
| `jinja` | Jinja Hub | Jinja Town |
| `namayemba` | Namayemba Hub | Namayemba, Mukono |
| `lyantode` | Lyantode Hub | Lyantode, Mpigi |

### Skill Categories (4 tracks)

| ID | Name |
|----|------|
| `graphic-design` | Graphic Design |
| `website-development` | Website Development |
| `film-photography` | Film & Photography |
| `alx-course` | ALX Course |

### Courses (6 courses across hubs)

| Course | Hub | Instructor | Max Students |
|--------|-----|------------|-------------|
| Website Development | Katanga | John Mukasa | 30 |
| Graphic Design | Kosovo | Sarah Namutebi | 25 |
| Film & Photography | Jinja | John Mukasa | 20 |
| ALX Course | Namayemba | Sarah Namutebi | 40 |
| Website Development | Lyantode | John Mukasa | 25 |
| Graphic Design | Katanga | Sarah Namutebi | 25 |

### Instructors (2 accounts)

All instructor accounts use password: `elevate2024`

| Employee ID | Name | Email | Hub | Specialization |
|-------------|------|-------|-----|----------------|
| INS-001 | John Mukasa | `john.mukasa@era92elevate.org` | Katanga | Website Development |
| INS-002 | Sarah Namutebi | `sarah.namutebi@era92elevate.org` | Kosovo | Graphic Design |

### Student Accounts (11 students)

All student accounts use password: `student2024`

| Student ID | Name | Email | Hub | Course |
|------------|------|-------|-----|--------|
| EA000001 | Jane Nakato | `jane.nakato@student.elevate.org` | Katanga | Website Development |
| EA000002 | Brian Ssekandi | `brian.ssekandi@student.elevate.org` | Katanga | Website Development |
| EA000003 | Mercy Apio | `mercy.apio@student.elevate.org` | Katanga | Graphic Design |
| EA000004 | David Okello | `david.okello@student.elevate.org` | Kosovo | Graphic Design |
| EA000005 | Grace Namugga | `grace.namugga@student.elevate.org` | Kosovo | Graphic Design |
| EA000006 | Peter Mugisha | `peter.mugisha@student.elevate.org` | Jinja | Film & Photography |
| EA000007 | Annet Akello | `annet.akello@student.elevate.org` | Jinja | Film & Photography |
| EA000008 | Moses Waiswa | `moses.waiswa@student.elevate.org` | Namayemba | ALX Course |
| EA000009 | Esther Nanyanzi | `esther.nanyanzi@student.elevate.org` | Lyantode | Website Development |
| EA000010 | Samuel Kato | `samuel.kato@student.elevate.org` | Lyantode | Website Development |
| EA000011 | Test Student *(default)* | `student@era92elevate.org` | Katanga | Website Development |

### Admin Account

Seeded separately via `npm run seed:admin`:

| Email | Password | Role |
|-------|----------|------|
| `admin@era92elevate.org` | `elevate2024` | Admin |

## File Structure

```
prisma/
├── seed.ts              # Main Prisma seed (hubs, courses, students, enrollments)
├── seed-admin.ts        # Admin + instructor TypeORM accounts
src/seed/
├── comprehensive-seed.service.ts   # Stub (delegates to prisma/seed.ts)
├── data/
│   ├── users.ts         # Admin and instructor user data
│   ├── hubs.ts          # Hub locations and skill categories
│   ├── courses.ts       # Course definitions and assignments
│   └── groups.ts        # Legacy group data
```

## Usage Examples

### Fresh Development Setup
```bash
# Run migrations
npx prisma migrate dev

# Seed all data
npm run seed:elevate
npm run seed:admin

# Start server
npm run start:dev
```

### Login as Admin
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@era92elevate.org",
    "password": "elevate2024"
  }'
```

### Login as Student
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student@era92elevate.org",
    "password": "student2024"
  }'
```

### Check Seeded Data (SQL)
```sql
-- Count students
SELECT COUNT(*) FROM student;

-- Students per hub
SELECT h.name, COUNT(s.id) FROM student s
JOIN hub h ON s."hubId" = h.id
GROUP BY h.name;

-- Enrollments per course
SELECT c.title, h.name AS hub, COUNT(e.id) AS enrollments
FROM enrollment e
JOIN course c ON e."courseId" = c.id
JOIN hub h ON c."hubId" = h.id
GROUP BY c.title, h.name;
```

## Troubleshooting

### Clear and Re-seed
```bash
npm run seed:clear
npm run seed:elevate
npm run seed:admin
```

### Student Already Exists
The seed uses `upsert` — re-running is safe. Existing records are skipped.

### Student ID Format
Student IDs follow the pattern `EA000001` (EA + 6-digit zero-padded number).
