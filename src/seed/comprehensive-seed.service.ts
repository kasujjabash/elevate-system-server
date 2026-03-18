import { Injectable, Logger } from '@nestjs/common';

/** Stub — comprehensive seed is done via prisma/seed.ts */
@Injectable()
export class ComprehensiveSeedService {
  async seedAll(): Promise<void> {
    Logger.log('Use prisma/seed.ts for Elevate Academy data seeding.');
  }

  async clearAll(): Promise<void> {
    Logger.log('Clear via prisma CLI.');
  }
}
