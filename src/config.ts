import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { usersEntities } from './users/users.helpers';
import { crmEntities } from './crm/crm.helpers';
import { helpEntities } from './help/help.helpers';
import { Report } from './reports/entities/report.entity';
import { ReportSubmission } from './reports/entities/report.submission.entity';
import { ReportSubmissionData } from './reports/entities/report.submission.data.entity';
import { ReportField } from './reports/entities/report.field.entity';

require('dotenv').config();

export function normalizePort(val: any) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

const isProduction = process.env.NODE_ENV === 'production';

// Support both DATABASE_URL (Render/Railway) and individual DB_* vars (local)
const databaseUrl = process.env.DATABASE_URL;

const database: TypeOrmModuleOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      cache: true,
      logging: process.env.DB_LOGGING === 'true',
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: normalizePort(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
      database: process.env.DB_DATABASE,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      cache: true,
      logging: process.env.DB_LOGGING === 'true',
    };

const config = {
  app: {
    port: normalizePort(process.env.PORT),
  },
  database: database,
};

export default config;

export const appEntities: any[] = [
  ...usersEntities,
  ...crmEntities,
  ...helpEntities,
  Report,
  ReportSubmission,
  ReportSubmissionData,
  ReportField,
];
console.log('#################appEntities#########', appEntities);
