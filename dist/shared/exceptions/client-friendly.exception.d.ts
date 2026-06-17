import { HttpException } from '@nestjs/common';
export default class ClientFriendlyException extends HttpException {
  constructor(response: string | Record<string, any>, status?: number);
}
