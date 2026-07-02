# Elevate Academy — API Endpoints Reference

**Base URL:** `http://localhost:4002`

All endpoints require a Bearer token **except** the public ones listed below:

```
Authorization: Bearer <token>
```

Login to get a token — see [Authentication](#authentication).

**Public (no token required):**

| Endpoint | Method |
|----------|--------|
| `/api/auth/login` | POST |
| `/api/auth/refresh` | POST |
| `/api/auth/forgot-password` | POST |
| `/api/auth/reset-password/:token` | PUT |
| `/api/register` | POST |
| `/api/bot` | GET |
| `/api/bot/ussd/at` | POST |
| `/api/attendance/session/:token` | GET |
| `/api/seed/status` | GET |
| `/api/seed/debug-user/:username` | GET |
| `/api/seed/users` | POST |

Everything else goes through the global JWT guard. Several endpoints additionally check `roles` on the logged-in user (noted per module below) and return `403 Forbidden` if the role doesn't match.

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

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/me` | GET | JWT | Current user |
| `/api/auth/profile` | GET | JWT | Get full user profile |
| `/api/auth/profile` | PUT | JWT | Update profile (firstName, lastName, phone) |
| `/api/auth/refresh` | POST | Public | Refresh access token |
| `/api/auth/logout` | POST | JWT | Logout |
| `/api/auth/forgot-password` | POST | Public | Request password reset |
| `/api/auth/reset-password/:token` | PUT | Public | Reset password with token |

---

## Dashboard

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/dashboard/stats` | GET | Staff only (ADMIN/SUPER_ADMIN/TRAINER/INSTRUCTOR/HUB_MANAGER) | Institution-wide stats |
| `/api/dashboard/hub-stats` | GET | Staff only | Stats per hub |
| `/api/dashboard/stats/top-performers` | GET | JWT | Top performing students |
| `/api/dashboard/all-performance` | GET | JWT (role-scoped) | Grades across students, scoped by hub/trainer when applicable |
| `/api/dashboard/summary` | GET | Staff only | Dashboard summary |
| `/api/dashboard/report-stats` | GET | Staff only | Report/enrollment breakdowns |
| `/api/dashboard/trainer-stats` | GET | JWT | Stats scoped to the logged-in trainer |
| `/api/dashboard/hub-manager-stats` | GET | JWT | Stats scoped to the logged-in hub manager |

---

## Students

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/students` | GET | JWT | List students (supports filters) |
| `/api/students/me/courses` | GET | JWT | Enrolled courses for the logged-in student |
| `/api/students/me/schedule` | GET | JWT | Schedule/calendar for the logged-in student |
| `/api/students/people` | POST | JWT | Create new student |
| `/api/students/people` | GET | JWT | People list for autocomplete |
| `/api/students/people/combo` | GET | JWT | People combo list |
| `/api/students/emails` | GET | JWT | Student emails |
| `/api/students/phones` | GET | JWT | Student phones |
| `/api/students/addresses` | GET | JWT | Student addresses |
| `/api/students/identifications` | GET | JWT | Student identifications |
| `/api/students/requests` | GET | JWT | List requests |
| `/api/students/requests` | POST | JWT | Create request |
| `/api/students/requests/:id/messages` | GET | JWT | Get request messages |
| `/api/students/requests/:id/messages` | POST | JWT | Add message to a request |
| `/api/students/student/avatar` | PUT | JWT | Update student avatar (file upload) |
| `/api/students/import` | POST | JWT | Import students (file upload) |
| `/api/students/:id` | GET | JWT | Get student by ID |
| `/api/students/:id` | PUT | JWT | Update student |
| `/api/students/:id/progress` | GET | JWT | Student progress |
| `/api/students/:id/resources` | GET | JWT | Student resources |
| `/api/students/:studentId/enroll/:courseId` | POST | JWT | Enroll student in course |
| `/api/student/hub` | GET | JWT | Students grouped by hub |
| `/api/student/search` | GET | JWT | Search students |

---

## Hubs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hubs` | POST | Create hub |
| `/api/hubs` | GET | List all hubs |
| `/api/hubs/:id` | GET | Get hub by ID |
| `/api/hubs/code/:code` | GET | Get hub by code (e.g. `katanga`) |
| `/api/hubs/:id/statistics` | GET | Hub statistics |
| `/api/hubs/:id` | PATCH | Update hub |
| `/api/hubs/:id` | DELETE | Delete hub |

---

## Courses

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/courses` | GET | List courses (trainers see own, admins see all) |
| `/api/courses` | POST | Create course (admin) |
| `/api/courses/course` | GET / POST | Same as `/api/courses` (legacy alias) |
| `/api/courses/:id` | GET | Get course by ID |
| `/api/courses/:id` | PUT | Update course (admin) |
| `/api/courses/combo` | GET | Courses dropdown list |
| `/api/courses/coursescombo` | GET | Courses combo (alias) |
| `/api/courses/coursereports` | GET | Course reports |
| `/api/courses/reportfrequency` | GET | Report frequency options |
| `/api/courses/request` | GET | Course requests |
| `/api/courses/category` | GET | List skill categories |
| `/api/courses/instructors` | GET | List instructors for dropdowns |
| `/api/courses/enrollment` | GET | Get enrollments (admin) |
| `/api/courses/enrollment` | POST | Enroll student in course (admin) |
| `/api/courses/:id/enroll` | POST | Enroll student by course ID (admin/hub-manager) |
| `/api/courses/:id/admin-enroll` | POST | Force-enroll a student (admin/hub-manager) |
| `/api/courses/enrollment/pending` | GET | List pending enrollment requests (admin) |
| `/api/courses/enrollment/:id/approve` | PATCH | Approve a pending enrollment request (admin) |
| `/api/courses/enrollment/:id/reject` | PATCH | Reject a pending enrollment request (admin) |
| `/api/courses/content/:contentId` | GET | Get course content |
| `/api/courses/content/:contentId` | PATCH | Update content (admin) |
| `/api/courses/content/:contentId` | DELETE | Delete content (admin) |
| `/api/courses/content/:contentId/complete` | POST | Mark lesson complete |
| `/api/courses/modules/:moduleId` | GET | Get module |
| `/api/courses/modules/:moduleId` | PATCH | Update/rename module (admin/trainer) |
| `/api/courses/modules/:moduleId/content` | POST | Add content to module (admin) |
| `/api/courses/:id/modules` | GET | Get modules for a course |
| `/api/courses/:id/modules` | POST | Add module to a course (admin) |
| `/api/courses/:id/progress` | GET | Get course progress |
| `/api/courses/:id/resources` | GET | Get course resources |
| `/api/courses/:id/resources` | POST | Add course resource |
| `/api/courses/:id/resources/:resourceId` | DELETE | Remove course resource |
| `/api/courses/:id/trainer-stats` | GET | Trainer stats for a course |
| `/api/courses/:id/instructor` | PUT | Assign instructor to course |

### Assignments (base `api/assignments`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assignments` | POST | Create an assignment (admin/trainer) |
| `/api/assignments` | GET | List assignments (role/contact scoped) |
| `/api/assignments/mine` | GET | Get logged-in student's own assignments |
| `/api/assignments/:id` | GET | Get single assignment |
| `/api/assignments/:id` | PATCH | Update an assignment (trainer/admin) |
| `/api/assignments/:id/submissions` | GET | Get submissions for an assignment (trainer-scoped) |
| `/api/assignments/:id/submissions` | POST | Submit assignment (text/link) |
| `/api/assignments/:id/submissions/file` | POST | Submit assignment (file upload) |
| `/api/assignments/submissions` | GET | List submissions (trainer-scoped unless admin) |
| `/api/assignments/submissions/:submissionId/grade` | PATCH | Grade a submission (admin/trainer) |
| `/api/assignments/submissions/:id/like` | POST | Like/acknowledge a submission (trainer) |
| `/api/assignments/submissions/:id/approve` | POST | Approve a course-player submission (trainer) |
| `/api/assignments/files` | GET | Get files |
| `/api/assignments/grades` | GET | Get grades |
| `/api/assignments/grades` | POST | Grade a submission via body |

### Exams (base `api/exams`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exams` | GET | List exams |
| `/api/exams` | POST | Create exam |
| `/api/exams/schedule` | GET | Get exam schedule |
| `/api/exams/results` | GET | Get exam results |
| `/api/exams/:id` | GET | Get single exam |

---

## Classes / Attendance

### Classes (base `api/classes`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/classes/class` | GET | List class sessions |
| `/api/classes/class` | POST | Create class session |
| `/api/classes/member` | GET | Classes a student attended |
| `/api/classes/attendance` | GET | Get attendance for a class |
| `/api/classes/attendance` | POST | Mark attendance |
| `/api/classes/registration` | GET | Class registrations |
| `/api/classes/registration` | POST | Register for a class |
| `/api/classes/category` | GET | Class categories |
| `/api/classes/fields` | GET | Class fields |
| `/api/classes/activities` | GET | Class activities |
| `/api/classes/metrics/raw` | GET | Raw metrics |
| `/api/classes/dayoff` | GET | Days off |

### Timetable (base `api/timetable`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/timetable/mine` | GET | Sessions for the logged-in user |
| `/api/timetable` | GET | Timetable (role-scoped) |
| `/api/timetable` | POST | Create a session (admin) |
| `/api/timetable/:id` | PUT | Update a session (admin) |
| `/api/timetable/:id` | DELETE | Delete a session (admin) |

### Attendance (base `api/attendance`) — QR + code-based check-in

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/attendance/sessions` | POST | Admin | Create a QR attendance session |
| `/api/attendance/sessions` | GET | Admin | List all sessions, paginated |
| `/api/attendance/sessions/:id` | GET | Admin | Get a session with its check-in list |
| `/api/attendance/sessions/:id/close` | PATCH | Admin | Close a session early |
| `/api/attendance/sessions/:id/manual` | POST | Admin | Manually add a student to a session |
| `/api/attendance/student-summary` | GET | JWT | Daily attendance count for the last N days (student dashboard) |
| `/api/attendance/student-history` | GET | Admin | Full attendance history for a student |
| `/api/attendance/checkin/:token` | POST | Student | Check in via QR token |
| `/api/attendance/checkin-code` | POST | Student | Check in by typing a short code |
| `/api/attendance/session/:token` | GET | Public | Validate token and show session info |
| `/api/attendance/stats` | GET | JWT | Attendance stats (enrolled/present/absent/inactive) |

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
| `/api/reports/:reportId/submissions/:submissionId` | GET | Single report submission |
| `/api/reports/:reportId/send-weekly-email` | POST | Send a weekly email summary |
| `/api/reports/submissions` | GET | All submissions |
| `/api/reports/submissions/me` | GET | My submissions |
| `/api/reports/submissions/team` | GET | Team submissions |
| `/api/reports/submissions/:id` | GET | Submission detail |

---

## Users & Roles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | List users |
| `/api/users` | POST | Create user |
| `/api/users` | PUT | Update user |
| `/api/users/:id` | GET | Get user by ID |
| `/api/users/:id` | PUT | Update user by ID |
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
| `/api/crm/contacts` | PUT | Update contact (legacy) |
| `/api/crm/contacts/:id` | GET | Get contact by ID |
| `/api/crm/contacts/:id` | PATCH | Update contact (partial) |
| `/api/crm/contacts/:id` | DELETE | Delete contact |
| `/api/crm/people` | GET | List people |
| `/api/crm/people/combo` | GET | People combo |
| `/api/crm/people` | POST | Create person |
| `/api/crm/people/upload` | POST | Upload a file for a person |
| `/api/crm/people` | PUT | Update person |
| `/api/crm/companies` | GET | List companies |
| `/api/crm/companies/combo` | GET | Companies combo |
| `/api/crm/companies` | POST | Create company |
| `/api/crm/companies` | PUT | Update company |
| `/api/crm/emails` | GET/POST/PUT | Manage emails |
| `/api/crm/emails/:id` | GET/DELETE | Get/delete an email |
| `/api/crm/phones` | GET/POST/PUT | Manage phones |
| `/api/crm/phones/:id` | GET/DELETE | Get/delete a phone |
| `/api/crm/addresses` | GET/POST/PUT | Manage addresses |
| `/api/crm/addresses/:id` | GET/DELETE | Get/delete an address |
| `/api/crm/identifications` | GET/POST/PUT | Manage identifications |
| `/api/crm/identifications/:id` | GET/DELETE | Get/delete an identification |
| `/api/crm/occasions` | GET/POST/PUT | Manage occasions |
| `/api/crm/occasions/:id` | GET/DELETE | Get/delete an occasion |
| `/api/crm/relationships` | GET/POST/PUT | Manage relationships |
| `/api/crm/relationships/:id` | GET/DELETE | Get/delete a relationship |
| `/api/crm/requests` | GET/POST/PUT | Manage requests |
| `/api/crm/requests/:id` | GET/DELETE | Get/delete a request |
| `/api/crm/import` | GET | Download sample CSV |
| `/api/crm/import` | POST | Upload CSV for bulk import |
| `/api/crm/import/groupLeaders` | POST | Upload group leaders from CSV |
| `/api/register` | POST | Register new user (self-signup, public) |

---

## Chat & Notifications

### Chat (base `api/chat`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/rooms` | GET | Get the logged-in user's chat rooms |
| `/api/chat/rooms` | POST | Create a new chat room |
| `/api/chat/rooms/:id/messages` | GET | Get messages in a room |
| `/api/chat/rooms/:id/messages` | POST | Send a message in a room |
| `/api/chat/contacts` | GET | Get chat contacts |
| `/api/chat/email` | POST | Send an email to contacts |
| `/api/chat` | GET | List all chats |
| `/api/chat/:id` | GET | Get single chat |
| `/api/chat/:id` | PUT | Update chat |
| `/api/chat/:id` | DELETE | Delete chat |

### Notifications (base `api/notifications`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get the logged-in user's notifications |
| `/api/notifications/read-all` | PATCH | Mark all notifications as read |
| `/api/notifications/:id/read` | PATCH | Mark a single notification as read |

---

## Announcements & Workshops

### Announcements (base `api/announcements`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/announcements` | GET | List announcements (active-only for students; `?all=true` for admins) |
| `/api/announcements` | POST | Create announcement (admin) |
| `/api/announcements/:id/toggle` | PATCH | Toggle announcement active/inactive (admin) |
| `/api/announcements/:id` | DELETE | Delete announcement (admin) |
| `/api/announcements/events` | GET | List calendar events (upcoming 60 days for students; `?all=true` for admins) |
| `/api/announcements/events` | POST | Create calendar event (admin) |
| `/api/announcements/events/:id` | DELETE | Delete calendar event (admin) |

### Workshops (base `api/workshops`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workshops` | GET | List workshops |
| `/api/workshops` | POST | Create workshop |
| `/api/workshops/:id` | GET | Get single workshop |
| `/api/workshops/:id` | PUT | Update workshop |
| `/api/workshops/:id` | DELETE | Delete workshop |

---

## Misc

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/help` | GET/POST/PUT | JWT | Manage help entries |
| `/api/help/:id` | GET/DELETE | JWT | Get/delete a help entry |
| `/api/search` | GET | JWT | Search across entities |
| `/vendor/place-details/:placeId` | GET | JWT | Google Place details lookup |
| `/api/bot` | GET | Public | Health/test endpoint |
| `/api/bot/ussd/at` | POST | Public | Africa's Talking USSD webhook |
| `/api/seed/status` | GET | Public | Get seed status |
| `/api/seed/debug-user/:username` | GET | Public | Debug user info |
| `/api/seed/users` | POST | Public | Trigger admin user seeding |

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

### Get dashboard stats (with token, staff role required)
```bash
curl http://localhost:4002/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

---

## Swagger UI

Interactive, always-in-sync API docs (generated from the `@ApiTags`/`@ApiBody` decorators in the code) are available while the server is running at:

```
http://localhost:4002/docs
```

Start the server (`npm run start:dev`), open that URL in a browser, and you can browse every route grouped by module, see request/response schemas, and call endpoints directly (use the "Authorize" button with a Bearer token from `/api/auth/login`).

This file is a static, hand-maintained mirror of the same routes for quick reference/grep — if the two ever disagree, Swagger (`/docs`) is the source of truth since it's generated straight from the controllers.
