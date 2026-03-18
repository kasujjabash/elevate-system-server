# Elevate Academy — API Endpoints Reference

**Base URL:** `http://localhost:4002`

All protected endpoints require:
```
Authorization: Bearer <token>
```

Login to get a token — see [Authentication](#authentication).

---

## Authentication

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "username": "admin@era92elevate.org",
  "password": "elevate2024",
  "hubName": "elevate"
}
```
**Response:** `{ token, user, hierarchy }`

> Student logins use `password: "student2024"`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/me` | GET | JWT | Current user |
| `/api/auth/profile` | GET | JWT | User profile |
| `/api/auth/refresh` | POST | JWT | Refresh token |
| `/api/auth/logout` | POST | JWT | Logout |
| `/api/auth/forgot-password` | POST | Public | Request password reset |
| `/api/auth/reset-password/:token` | PUT | Public | Reset password |

---

## Students

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/students` | GET | List all students (supports filters) |
| `/api/students/:id` | GET | Get student by ID |
| `/api/students/:id` | PUT | Update student |
| `/api/students/:id/progress` | GET | Student progress |
| `/api/students/:id/resources` | GET | Student resources |
| `/api/students/:studentId/enroll/:courseId` | POST | Enroll student in course |
| `/api/students/import` | POST | Import students from file |
| `/api/student/hub` | GET | Students grouped by hub |
| `/api/student/search` | GET | Search students |

---

## Hubs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hubs` | GET | List all hubs |
| `/api/hubs` | POST | Create hub |
| `/api/hubs/:id` | GET | Get hub by ID |
| `/api/hubs/code/:code` | GET | Get hub by code (e.g. `katanga`) |
| `/api/hubs/:id/statistics` | GET | Hub statistics |
| `/api/hubs/:id` | PATCH | Update hub |
| `/api/hubs/:id` | DELETE | Delete hub |

---

## Courses

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/courses/course` | GET | List all courses |
| `/api/courses/course` | POST | Create course |
| `/api/courses/:id` | GET | Get course by ID |
| `/api/courses/combo` | GET | Courses dropdown list |
| `/api/courses/category` | GET | List skill categories |
| `/api/courses/enrollment` | GET | Get enrollments for a student |
| `/api/courses/enrollment` | POST | Enroll student in course |

---

## Dashboard

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Overall statistics |
| `/api/dashboard/hub-stats` | GET | Stats per hub |
| `/api/dashboard/stats/top-performers` | GET | Top performing students |
| `/api/dashboard/summary` | GET | Dashboard summary |

---

## Classes (Sessions)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/classes/class` | GET | List class sessions |
| `/api/classes/class` | POST | Create class session |
| `/api/classes/attendance` | GET | Get attendance for a class |
| `/api/classes/attendance` | POST | Mark attendance |
| `/api/classes/registration` | GET | Class registrations |
| `/api/classes/registration` | POST | Register for a class |
| `/api/classes/member` | GET | Classes a student attended |

---

## Reports

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reports` | GET | List all reports |
| `/api/reports` | POST | Create report |
| `/api/reports/:id` | GET | Get report by ID |
| `/api/reports/:id` | PUT | Update report |
| `/api/reports/:reportId/submissions` | GET | All submissions for a report |
| `/api/reports/:reportId/submissions` | POST | Submit a report |
| `/api/reports/submissions/me` | GET | My submissions |
| `/api/reports/submissions/team` | GET | Team submissions |
| `/api/reports/submissions/:id` | GET | Submission detail |

---

## Users & Roles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | List users |
| `/api/users` | POST | Create user |
| `/api/users/:id` | GET | Get user by ID |
| `/api/users/:id` | DELETE | Delete user |
| `/api/user-roles` | GET | List roles |
| `/api/user-roles` | POST | Create role |
| `/api/user-roles/:id` | GET | Get role by ID |
| `/api/user-roles` | PUT | Update role |
| `/api/user-roles/:id` | DELETE | Delete role |

---

## CRM / Contacts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/crm/contacts` | GET | List contacts |
| `/api/crm/contacts` | POST | Create contact |
| `/api/crm/contacts/:id` | GET | Get contact by ID |
| `/api/crm/contacts/:id` | PATCH | Update contact |
| `/api/crm/contacts/:id` | DELETE | Delete contact |
| `/api/crm/people` | GET | List people |
| `/api/crm/people` | POST | Create person |
| `/api/crm/emails` | GET/POST/PUT/DELETE | Manage emails |
| `/api/crm/phones` | GET/POST/PUT/DELETE | Manage phones |
| `/api/crm/addresses` | GET/POST/PUT/DELETE | Manage addresses |
| `/api/crm/import` | POST | Import contacts from CSV |
| `/api/register` | POST | Register new user |

---

## Help

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/help` | GET | List help items |
| `/api/help` | POST | Create help item |
| `/api/help/:id` | GET | Get help item |
| `/api/help` | PUT | Update help item |
| `/api/help/:id` | DELETE | Delete help item |

---

## Quick Test Examples

### Login as admin
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@era92elevate.org","password":"elevate2024","hubName":"elevate"}'
```

### Login as student
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student@era92elevate.org","password":"student2024","hubName":"elevate"}'
```

### Get all hubs (with token)
```bash
curl http://localhost:4002/api/hubs \
  -H "Authorization: Bearer <token>"
```

### Get all students (with token)
```bash
curl http://localhost:4002/api/students \
  -H "Authorization: Bearer <token>"
```

### Get dashboard stats (with token)
```bash
curl http://localhost:4002/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

---

## Swagger UI

Interactive API docs available at:
```
http://localhost:4002/docs
```
