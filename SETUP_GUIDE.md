# Project Zoe Server - Local Setup Guide

This guide documents the complete setup process for the Project Zoe Server on macOS, including all issues encountered and their solutions.

## Overview

Project Zoe Server is a NestJS-based church management system with multi-tenant architecture. This guide covers the local development setup process and troubleshooting steps.

## Prerequisites

- Node.js 12.22.5 (as specified in package.json)
- npm 6.14.5 (as specified in package.json)
- PostgreSQL (installed via Homebrew)
- macOS environment

## Setup Process

### 1. Initial Environment Setup

```bash
# Copy environment template
cp .env.sample .env
```

**Issue**: Missing `APP_ENVIRONMENT` variable mentioned in setup instructions.

**Solution**: Added the missing environment variable to `.env`:

```properties
APP_ENVIRONMENT=local
```

### 2. Dependency Installation

```bash
# Install dependencies with specific npm version
npx npm@6.14.5 install
```

**Issue**: Using modern npm version (10.9.0) with lockfile compatibility warnings.

**Solution**: Used the specified npm version 6.14.5 as required by the project, which resolved lockfile version conflicts.

### 3. TypeScript Compilation Errors

**Issue**: Axios version incompatibility causing TypeScript compilation failures:

```
error TS2315: Type 'AxiosRequestConfig' is not generic.
error TS2707: Generic type 'AxiosResponse<T>' requires between 0 and 1 type arguments.
```

**Root Cause**: The project had axios@0.19.2 (deprecated and insecure) while @nestjs/axios required axios@^1.3.1.

**Solution**:

```bash
npm install axios@^1.6.0
```

This resolved all TypeScript compilation errors related to axios generics.

### 4. Database Setup

#### PostgreSQL Service Management

```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Start PostgreSQL service
brew services start postgresql@14

# Create project database
createdb projectzoe-db
```

#### Database Connection Issues

**Issue**: SSL connection errors when creating tenant:

```
Error: The server does not support SSL connections
```

**Root Cause**: Multiple SSL configuration conflicts:

1. Local PostgreSQL had SSL disabled (`SHOW ssl;` returned `off`)
2. Application was trying to force SSL connections in two places

**Solutions Applied**:

1. **Updated `src/config.ts`**:

```typescript
// Before
ssl: process.env.DB_PORT === '25060'
  ? { rejectUnauthorized: false }
  : undefined,

// After
ssl: process.env.DB_PORT === '25060'
  ? { rejectUnauthorized: false }
  : false,
```

2. **Updated `src/shared/db.service.ts`**:

```typescript
// Before
ssl: {
  rejectUnauthorized: false, // Required for DigitalOcean & Heroku
},

// After
ssl: process.env.DB_PORT === '25060'
  ? { rejectUnauthorized: false }
  : false,
```

3. **Updated DATABASE_URL in `.env`**:

```properties
DATABASE_URL="postgresql://macbookpro:@localhost:5432/projectzoe-db?schema=public&ssl=false"
```

4. **Updated database credentials**:

```properties
DB_USERNAME=macbookpro  # macOS username instead of 'postgres'
DB_PASSWORD=            # Empty for local trust authentication
```

### 5. Tenant Creation

```bash
npm run command create-tenant demo
```

After resolving SSL issues, this command successfully:

- Created database schemas
- Seeded initial data (users, roles, groups, categories)
- Set up the "demo" tenant

### 6. Development Server

```bash
npm run start:dev
```

**Issue**: Express package missing error:

```
[Nest] ERROR [PackageLoader] The "express" package is missing. Please, make sure to install it to take advantage of ServeStaticModule.
```

**Root Cause**: The `ServeStaticModule` requires the `express` package as a peer dependency, but it wasn't installed.

**Solution**:

```bash
npx npm@6.14.5 install express
```

After resolving this, the server successfully starts on port 4002 with hot reload enabled.

## Configuration Summary

### Final `.env` Configuration

```properties
PORT=4002
APP_ENVIRONMENT=local
DB_TYPE=postgres
DB_USERNAME=macbookpro
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=projectzoe-db
DB_SYNCHRONIZE=true
MAPS_URL=https://maps.googleapis.com/maps/api/place/details/json
MAPS_KEY=your-api-key-here
APP_URL=http://localhost:3000
SENDGRID_API=your-api-key-here
EMAIL_SENDER=example@email.com
DATABASE_URL="postgresql://macbookpro:@localhost:5432/projectzoe-db?schema=public&ssl=false"
REACT_APP_SENTRY_DSN=sentry_dsn

# Google Spreadsheet Config
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-acc-auth.json
GOOGLE_SPREADSHEET_ID=spread-sheet-id-here
GOOGLE_SPREADSHEET_SHEET_NAME=Sheet1
```

## Login Credentials

After tenant creation, use these credentials to login to the "demo" tenant:

**Admin User 1:**

- Email: `john.doe@kanzucodefoundation.org`
- Password: `Xpass@123`

**Admin User 2:**

- Email: `jane.doe@kanzucodefoundation.org`
- Password: `Password@1`

## API Endpoints

The server runs at `http://localhost:4002` with these main endpoints:

- **Authentication**: `POST /api/auth/login`
- **User Management**: `/api/users/*`
- **CRM**: `/api/crm/*`
- **Groups**: `/api/groups/*`
- **Events**: `/api/events/*`
- **Reports**: `/api/reports/*`
- **Bot**: `/api/bot/*`

## Issues Resolution Summary

| Issue                         | Root Cause                                 | Solution                      |
| ----------------------------- | ------------------------------------------ | ----------------------------- |
| Missing APP_ENVIRONMENT       | Incomplete .env template                   | Added `APP_ENVIRONMENT=local` |
| TypeScript compilation errors | Axios version incompatibility              | Upgraded axios to 1.6.0       |
| SSL connection failures       | Hardcoded SSL configs for cloud deployment | Conditional SSL based on port |
| Database authentication       | Wrong username assumption                  | Used macOS username           |
| Dependency conflicts          | npm version mismatch                       | Used specified npm 6.14.5     |
| Express package missing       | ServeStaticModule peer dependency          | Installed express package     |

## Development Notes

1. **SSL Configuration**: The application is designed for cloud deployment (DigitalOcean/Heroku) with SSL, but requires conditional logic for local development.

2. **Multi-tenant Architecture**: Each tenant gets its own database schema. The "public" schema contains tenant metadata.

3. **Prisma Integration**: The application uses both TypeORM and Prisma, requiring both to be configured correctly.

4. **Hot Reload**: Development server supports hot reload for rapid development.

## Troubleshooting

### Common Issues

1. **Port Already in Use**: If port 4002 is busy, change `PORT` in `.env`
2. **PostgreSQL Not Running**: Run `brew services start postgresql@14`
3. **Permission Errors**: Ensure your user has database creation privileges
4. **SSL Errors**: Verify SSL is set to `false` in all configuration files

### Verification Commands

```bash
# Check PostgreSQL status
psql -h localhost -p 5432 -U macbookpro -d projectzoe-db -c "SELECT version();"

# Check server health
curl http://localhost:4002/api/auth/login

# View application logs
npm run start:dev
```

This setup process ensures a fully functional local development environment for the Project Zoe Server.
