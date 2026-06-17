import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import ClientFriendlyException from '../shared/exceptions/client-friendly.exception';
import { QueryFailedError } from 'typeorm';

function parseValidationErrors(exception: BadRequestException) {
  const res = exception.getResponse() as any;
  // ValidationPipe puts the array of messages in res.message
  const messages: string[] = Array.isArray(res?.message)
    ? res.message
    : [res?.message || exception.message];
  return {
    message: messages[0],
    errors: messages,
  };
}

function handleHttpException(exception: HttpException, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  const status = exception.getStatus();

  if (exception instanceof BadRequestException) {
    const data = parseValidationErrors(exception);
    response.status(status).json({ ...data, statusCode: status });
    return;
  }

  if (exception instanceof ClientFriendlyException) {
    const msg = exception.getResponse();
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        typeof msg === 'string' ? msg : (msg as any)?.message || 'Bad request',
    });
    return;
  }

  // All other HttpExceptions (NotFoundException, plain HttpException, etc.)
  const res = exception.getResponse() as any;
  const message =
    typeof res === 'string'
      ? res
      : res?.message || exception.message || 'Request failed';
  response.status(status).json({ statusCode: status, message });
}

function handleQueryFailedError(
  exception: QueryFailedError,
  host: ArgumentsHost,
) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  const request = ctx.getRequest<Request>();
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  if (exception['code'] === 'ER_DUP_ENTRY') {
    message =
      'This email address is already registered. Please use a different email.';
    status = HttpStatus.BAD_REQUEST;
  }
  if (exception['code'] === '23505') {
    // pg unique_violation — catches duplicate username/email at DB level
    message =
      'This email address is already registered. Please use a different email.';
    status = HttpStatus.BAD_REQUEST;
  }
  if (exception['code'] === '23503') {
    // pg foreign_key_violation
    message = 'Data integrity error, please check input';
    status = HttpStatus.BAD_REQUEST;
  }
  response.status(status).json({
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: request.url,
    message,
  });
}

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log(exception);
    Logger.error('Internal error', JSON.stringify(exception));
    if (exception instanceof HttpException) {
      return handleHttpException(exception, host);
    }

    if (exception instanceof QueryFailedError) {
      return handleQueryFailedError(exception, host);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ClientFriendlyException) {
      response.status(HttpStatus.BAD_REQUEST).json({
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
}
