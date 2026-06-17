'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require('@nestjs/common');
const client_friendly_exception_1 = require('../shared/exceptions/client-friendly.exception');
const typeorm_1 = require('typeorm');
function parseValidationErrors(exception) {
  const res = exception.getResponse();
  const messages = Array.isArray(res?.message)
    ? res.message
    : [res?.message || exception.message];
  return {
    message: messages[0],
    errors: messages,
  };
}
function handleHttpException(exception, host) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse();
  const status = exception.getStatus();
  if (exception instanceof common_1.BadRequestException) {
    const data = parseValidationErrors(exception);
    response.status(status).json({ ...data, statusCode: status });
    return;
  }
  if (exception instanceof client_friendly_exception_1.default) {
    const msg = exception.getResponse();
    response.status(common_1.HttpStatus.BAD_REQUEST).json({
      statusCode: common_1.HttpStatus.BAD_REQUEST,
      message: typeof msg === 'string' ? msg : msg?.message || 'Bad request',
    });
    return;
  }
  const res = exception.getResponse();
  const message =
    typeof res === 'string'
      ? res
      : res?.message || exception.message || 'Request failed';
  response.status(status).json({ statusCode: status, message });
}
function handleQueryFailedError(exception, host) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse();
  const request = ctx.getRequest();
  let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  if (exception['code'] === 'ER_DUP_ENTRY') {
    message =
      'This email address is already registered. Please use a different email.';
    status = common_1.HttpStatus.BAD_REQUEST;
  }
  if (exception['code'] === '23505') {
    message =
      'This email address is already registered. Please use a different email.';
    status = common_1.HttpStatus.BAD_REQUEST;
  }
  if (exception['code'] === '23503') {
    message = 'Data integrity error, please check input';
    status = common_1.HttpStatus.BAD_REQUEST;
  }
  response.status(status).json({
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: request.url,
    message,
  });
}
let HttpExceptionFilter = class HttpExceptionFilter {
  catch(exception, host) {
    console.log(exception);
    common_1.Logger.error('Internal error', JSON.stringify(exception));
    if (exception instanceof common_1.HttpException) {
      return handleHttpException(exception, host);
    }
    if (exception instanceof typeorm_1.QueryFailedError) {
      return handleQueryFailedError(exception, host);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof client_friendly_exception_1.default) {
      response.status(common_1.HttpStatus.BAD_REQUEST).json({
        message: exception.getResponse(),
      });
      return;
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    });
  }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate(
  [(0, common_1.Catch)(Error)],
  HttpExceptionFilter,
);
//# sourceMappingURL=http-exception.filter.js.map
