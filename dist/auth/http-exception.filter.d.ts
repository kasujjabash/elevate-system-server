import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void;
}
