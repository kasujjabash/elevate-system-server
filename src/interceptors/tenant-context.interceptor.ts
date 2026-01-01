import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
import { IS_PUBLIC_KEY } from '../auth/decorators/public.decorator';

/**
 * TenantContextInterceptor - Runs after JWT auth guard to enrich request with user context
 * 
 * This interceptor:
 * - Skips processing for routes marked with @Public() decorator
 * - For authenticated requests, fetches full user data (including tenant relation)
 * - Adds request.fullUser, request.tenant, and request.tenantId to the request
 * - Assumes user-tenant relationship is valid (users can't exist without tenants)
 */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TenantContextInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    this.logger.debug(`Interceptor running for route: ${request.method} ${request.path}`);
    this.logger.debug(`Request.user exists: ${!!request.user}`);
    
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Skipping tenant context for public route');
      return next.handle();
    }

    // If user exists (from JWT auth guard), enrich the request with full user context
    if (request.user) {
      this.logger.debug(`Processing user: ${JSON.stringify(request.user)}`);
      try {
        // Fetch full user data (should include tenant relation)
        const fullUser = await this.usersService.findById(request.user.sub);
        if (!fullUser) {
          throw new UnauthorizedException(`User ${request.user.sub} not found`);
        }

        // Add enriched data to request
        request.fullUser = fullUser;
        
        // Get tenant information from user's contact
        if (fullUser.contact?.tenant) {
          request.tenant = fullUser.contact.tenant;
          request.tenantId = fullUser.contact.tenant.id;
          this.logger.log(`User context set: User ${fullUser.id} (${fullUser.username}) - Tenant ${fullUser.contact.tenant.id} (${fullUser.contact.tenant.name})`);
          this.logger.debug(`Request.tenantId set to: ${request.tenantId}`);
          this.logger.debug(`Request.tenant.id set to: ${request.tenant?.id}`);
        } else {
          this.logger.warn(`User ${fullUser.id} has no tenant relationship`);
        }
      } catch (error) {
        this.logger.error(`Failed to set user context: ${error.message}`);
        throw new UnauthorizedException(`User context error: ${error.message}`);
      }
    } else {
      this.logger.warn(`No request.user found - JWT auth guard may not have run or token is missing`);
    }

    return next.handle();
  }
}