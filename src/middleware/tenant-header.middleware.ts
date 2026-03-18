import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { lowerCaseRemoveSpaces } from 'src/utils/stringHelpers';

/**
 * From the hubName field in the body of the request,
 * add a tenant header
 */
@Injectable()
export class TenantHeaderMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const hubName = req.body.hasOwnProperty('hubName')
      ? req.body['hubName']
      : req.query['hubName'];
    const tenant = lowerCaseRemoveSpaces(hubName);
    req.headers.tenant = tenant;
    Logger.log(`New request received from hub: ${tenant}`);
    next();
  }
}
