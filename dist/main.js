'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
require('module-alias/register');
const core_1 = require('@nestjs/core');
const path_1 = require('path');
require('reflect-metadata');
const app_module_1 = require('./app.module');
const helmet_1 = require('helmet');
const express_rate_limit_1 = require('express-rate-limit');
const compression = require('compression');
const swagger_1 = require('@nestjs/swagger');
const config_1 = require('./config');
const common_1 = require('@nestjs/common');
const http_exception_filter_1 = require('./auth/http-exception.filter');
const Sentry = require('@sentry/node');
async function bootstrap() {
  const app = await core_1.NestFactory.create(app_module_1.AppModule, {
    bodyParser: false,
  });
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.use((0, helmet_1.default)());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use(compression());
  app.use(
    (0, express_rate_limit_1.default)({
      windowMs: 15 * 60 * 1000,
      max: 10000,
    }),
  );
  app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
  app.useGlobalPipes(
    new common_1.ValidationPipe({
      transform: true,
    }),
  );
  const options = new swagger_1.DocumentBuilder()
    .setTitle('Elevate Academy API')
    .setDescription(
      'API for Elevate Academy School Management System - Digital Skills Training Platform',
    )
    .setVersion('1.0')
    .build();
  const document = swagger_1.SwaggerModule.createDocument(app, options);
  swagger_1.SwaggerModule.setup('docs', app, document, {});
  if (process.env.APP_ENVIRONMENT === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
    });
  }
  await app.listen(config_1.default.app.port);
}
bootstrap();
//# sourceMappingURL=main.js.map
