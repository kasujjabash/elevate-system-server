# About Elevate Academy

Elevate Academy is a digital skills school management system focused on empowering students with modern digital skills. The platform simplifies the process of managing students, courses, and educational resources across multiple learning hubs, specialized in digital skills training including website development, video production, film and photography, and UI/UX design.

# The Tech

This repository contains the Elevate Academy School Management System server.

## Project Setup / Installation 🚀

1. Clone the repository:

   > `git clone <your-elevate-academy-repo-url>`

2. Install dependencies:

   > `npm install`

3. Create a `.env` file based on the `.env.sample`.

   Set these environment variables in the `env` file as follows

   > `APP_ENVIRONMENT=local` - If you are running the app locally.

   > `DB_USERNAME=<your-local-postgres-db-username>`

   > `DB_PASSWORD=<your-local-postgres-db-password>`

   > `DB_DATABASE=elevate-academy-db`

4. Go ahead and manually create a new postgreSQL database called: `elevate-academy-db`

5. Finally, spin up the project with:

   > `npm run start:dev`

6. Create and seed data for a new school hub by running:
   > `npm run command create-hub kosovo `

This will create a hub named `kosovo`. You can login to that hub using the default admin credentials.

## Test Login Credentials

Run `npm run seed:elevate && npm run seed:admin` to create all accounts.

**Login request format** (`POST /api/auth/login`):
```json
{
  "username": "admin@era92elevate.org",
  "password": "elevate2024",
  "hubName": "elevate"
}
```

### Super Admin

| Email | Password | Role |
|-------|----------|------|
| `superadmin@elevate.org` | `admin2024` | SUPER_ADMIN |

### Hub Managers

| Email | Password | Role | Hub |
|-------|----------|------|-----|
| `robert.kizza@hub.elevate.org` | `hubmanager2024` | HUB_MANAGER | Katanga |
| `annet.nabukenya@hub.elevate.org` | `hubmanager2024` | HUB_MANAGER | Kosovo |
| `isaac.opio@hub.elevate.org` | `hubmanager2024` | HUB_MANAGER | Jinja |

### Trainers / Instructors

| Email | Password | Role | Specialization |
|-------|----------|------|----------------|
| `admin@era92elevate.org` | `elevate2024` | ADMIN | — |
| `instructor@era92elevate.org` | `elevate2024` | TRAINER | Website Development |
| `trainer@era92elevate.org` | `elevate2024` | TRAINER | General |
| `daniel.ochieng@trainer.elevate.org` | `trainer2024` | TRAINER | Film & Photography |
| `grace.akello@trainer.elevate.org` | `trainer2024` | TRAINER | ALX Course |
| `patrick.ssali@trainer.elevate.org` | `trainer2024` | TRAINER | Graphic Design (Kosovo) |
| `miriam.atim@trainer.elevate.org` | `trainer2024` | TRAINER | Website Development (Kosovo) |
| `peter.mwanje@trainer.elevate.org` | `trainer2024` | TRAINER | Website Development |
| `nickolus.onapa@trainer.elevate.org` | `trainer2024` | TRAINER | Graphic Design |
| `andrew@trainer.elevate.org` | `trainer2024` | TRAINER | UI/UX Design |
| `mark.omudigi@trainer.elevate.org` | `trainer2024` | TRAINER | Film & Photography |

### Demo Students

| Email | Password | Hub | Course |
|-------|----------|-----|--------|
| `webdev.student@era92elevate.org` | `student2024` | Katanga | Website Development |
| `design.student@era92elevate.org` | `student2024` | Kosovo | Graphic Design |
| `student@era92elevate.org` | `student2024` | Katanga | Website Development *(default)* |

### Named Students

| Email | Password | Hub | Course |
|-------|----------|-----|--------|
| `jane.nakato@student.elevate.org` | `student2024` | Katanga | Website Development |
| `brian.ssekandi@student.elevate.org` | `student2024` | Katanga | Website Development |
| `mercy.apio@student.elevate.org` | `student2024` | Katanga | Graphic Design |
| `david.okello@student.elevate.org` | `student2024` | Kosovo | Graphic Design |
| `grace.namugga@student.elevate.org` | `student2024` | Kosovo | Graphic Design |
| `peter.mugisha@student.elevate.org` | `student2024` | Jinja | Film & Photography |
| `annet.akello@student.elevate.org` | `student2024` | Jinja | Film & Photography |
| `moses.waiswa@student.elevate.org` | `student2024` | Namayemba | ALX Course |
| `esther.nanyanzi@student.elevate.org` | `student2024` | Lyantode | Website Development |
| `samuel.kato@student.elevate.org` | `student2024` | Lyantode | Website Development |

**Please Note:**

- If you don't have `node.js` installed, check out this guide https://nodejs.org/en/
- This repo works with the client at https://github.com/kanzucodefoundation/project-zoe-client so be sure to set that up too.

### Installation errors

1. `sh: eslint: command not found`

**Solution:** Run `npm install -g eslint` then `eslint --init`
If that fails, other alternatives here https://github.com/eslint/eslint/issues/10192

## Commitizen friendly

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Github Action

This repo is automatically deployed to the prod server using github actions. We create an `.env` file during the deployment process. Rather than add each environment variable to the file one by one, we copied a complete `.env` file and encrypted it using base64. We use the command:

```
openssl base64 -A -in .env -out .env.prod.encrypted
```

We then get the contents of `.env.prod.encrypted` and add them as a Github Action variable called `PROD_ENV_FILE`
