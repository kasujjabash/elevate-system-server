# Elevate Academy Server — Local Setup Guide

This guide covers the complete setup process for the Elevate Academy Server on macOS.

## Overview

Elevate Academy Server is a NestJS backend for managing digital skills training across multiple hubs. It uses both **TypeORM** (for CRM/contacts/users) and **Prisma** (for students, courses, hubs, and enrollments).

- **Server:** `http://localhost:4002`
- **Client:** `http://localhost:3000`
- **Database:** PostgreSQL — `elevate-academy-db`

---

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL (installed via Homebrew)

---

## Setup Steps

### 1. Install Dependencies

```bash
# Server
cd "elevater server"
npm install

# Client
cd "elevate client"
npm install
```

### 2. Environment Configuration

Edit `elevater server/.env`:

```properties
PORT=4002
APP_ENVIRONMENT=local

# TypeORM (CRM / Auth tables)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=<your-mac-username>
DB_PASSWORD=
DB_DATABASE=elevate-academy-db
DB_SYNCHRONIZE=true

# Prisma (Students / Courses / Hubs)
DATABASE_URL="postgresql://<your-mac-username>:@localhost:5432/elevate-academy-db?schema=public&ssl=false"

# JWT
JWT_SECRET=elevate-academy-jwt-secret-2024
JWT_EXPIRY=24h
APP_URL=http://localhost:3000
```

> Run `whoami` in terminal to get your macOS username.

### 3. PostgreSQL Setup

```bash
brew services start postgresql@14
createdb elevate-academy-db
```

### 4. Push Prisma Schema

```bash
cd "elevater server"
npx prisma db push --accept-data-loss
npx prisma generate
```

### 5. Seed the Database

```bash
npm run seed:elevate
```

This seeds: 5 hubs, 4 skill categories, 2 instructors, 6 courses, 11 students, course modules and content.

### 6. Start Both Apps

```bash
# Terminal 1 — Server (port 4002)
cd "elevater server"
npm run start:dev

# Terminal 2 — Client (port 3000)
cd "elevate client"
npm start
```

---

## Login Credentials

### Admin
| Email | Password | Notes |
|-------|----------|-------|
| `admin@era92elevate.org` | `admin2024` | Full admin access |
| `instructor@era92elevate.org` | `admin2024` | Admin + Instructor |
| `trainer@era92elevate.org` | `admin2024` | Admin + Instructor |

### Students — all use password `student2024`

| Name | Email | Hub | Course |
|------|-------|-----|--------|
| Jane Nakato | `jane.nakato@student.elevate.org` | Katanga | Website Development |
| Brian Ssekandi | `brian.ssekandi@student.elevate.org` | Katanga | Website Development |
| Mercy Apio | `mercy.apio@student.elevate.org` | Katanga | Graphic Design |
| David Okello | `david.okello@student.elevate.org` | Kosovo | Graphic Design |
| Grace Namugga | `grace.namugga@student.elevate.org` | Kosovo | Graphic Design |
| Peter Mugisha | `peter.mugisha@student.elevate.org` | Jinja | Film & Photography |
| Annet Akello | `annet.akello@student.elevate.org` | Jinja | Film & Photography |
| Moses Waiswa | `moses.waiswa@student.elevate.org` | Namayemba | ALX Course |
| Esther Nanyanzi | `esther.nanyanzi@student.elevate.org` | Lyantode | Website Development |
| Samuel Kato | `samuel.kato@student.elevate.org` | Lyantode | Website Development |
| Generic Student | `student@era92elevate.org` | Katanga | Website Development |

---

## Course Content (Website Development)

The **Website Development** course is fully seeded with 4 weeks:

| Week | Title | Content |
|------|-------|---------|
| 1 | HTML Foundations | Lesson (w/ YouTube video), Video lesson, Text lesson, Assignment |
| 2 | CSS Styling | Text lesson, Video lesson, Text lesson |
| 3 | JavaScript Basics | Text lesson, Video lesson, Text lesson |
| 4 | React Basics | Video lesson |

- **Current week** auto-opens to the first week with incomplete content
- Each lesson can have a **video** (YouTube embed) + **text** body
- Assignments appear separately at the bottom of each week
- Progress updates automatically when a student marks a lesson complete

### Admin: Add Content via API

```bash
# Add a new week/module
POST /api/courses/:courseId/modules
{ "title": "Week 5: Deployment", "weekNumber": 5, "order": 5 }

# Add content to a module
POST /api/courses/modules/:moduleId/content
{
  "title": "Deploying to Netlify",
  "type": "Video",          # Lesson | Video | Quiz | Assignment | Resource
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "body": "<h2>...</h2><p>...</p>",
  "durationMin": 10
}
```

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login — returns JWT token |
| GET | `/api/auth/me` | Current user profile |
| GET | `/api/auth/profile` | Alias for /me |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |

### Courses
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/courses/course` | All courses (supports `?hub=&isActive=`) |
| GET | `/api/courses/combo` | Course name/id list for dropdowns |
| GET | `/api/courses/category` | Skill categories |
| GET | `/api/courses/enrollment` | Enrollments (supports `?contactId=`) |
| POST | `/api/courses/enrollment` | Enroll a student |
| GET | `/api/courses/coursereports` | Course stats |
| GET | `/api/courses/:id` | Single course with modules |
| GET | `/api/courses/:id/modules` | Weekly modules + content list |
| GET | `/api/courses/:id/progress` | Student progress for a course |
| POST | `/api/courses/:id/modules` | Create a module (admin) |
| GET | `/api/courses/modules/:moduleId` | Single module with content |
| POST | `/api/courses/modules/:moduleId/content` | Add content (admin) |
| GET | `/api/courses/content/:contentId` | Single content item |
| POST | `/api/courses/content/:contentId/complete` | Mark content complete |

### Students
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/students` | All students |
| GET | `/api/students/people` | People list for autocomplete |
| GET | `/api/students/people/combo` | Name/id pairs for dropdowns |
| GET | `/api/students/:id` | Single student profile |
| PUT | `/api/students/:id` | Update student |
| GET | `/api/student/hub` | Students grouped by hub |

### Hubs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/hubs` | All hubs |
| GET | `/api/hubs/:id` | Single hub |
| POST | `/api/hubs` | Create hub |

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/stats` | Total students, courses, enrollments |
| GET | `/api/dashboard/hub-stats` | Per-hub student counts |
| GET | `/api/dashboard/summary` | Combined dashboard summary |

---

## SSL Fix (Local Development)

If you see SSL errors, ensure `DATABASE_URL` in `.env` has `ssl=false`:

```properties
DATABASE_URL="postgresql://macbookpro:@localhost:5432/elevate-academy-db?schema=public&ssl=false"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change `PORT` in `.env` |
| PostgreSQL not running | `brew services start postgresql@14` |
| SSL connection error | Add `ssl=false` to `DATABASE_URL` |
| Prisma client not found | `npx prisma generate` |
| Schema not in sync | `npx prisma db push --accept-data-loss` |
| Login returns 401 | Check password hash — re-run seed |
| Null roles error | Run the fix-roles script (see below) |

### Fix Null Roles (if login fails)

```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, database: 'elevate-academy-db', user: process.env.USER, password: '' });
pool.query('UPDATE \"user\" SET roles = \$1 WHERE username IN (\$2,\$3,\$4)', ['RoleAdmin','admin@era92elevate.org','instructor@era92elevate.org','trainer@era92elevate.org'])
  .then(() => pool.query('UPDATE \"user\" SET roles = \$1 WHERE roles IS NULL OR roles NOT LIKE \$2', ['STUDENT','Role%']))
  .then(() => { console.log('Done'); pool.end(); });
"
```

### Verification

```bash
# Check server is running
curl http://localhost:4002/api/courses/course

# Test login
curl -s -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@era92elevate.org","password":"admin2024"}'
```
