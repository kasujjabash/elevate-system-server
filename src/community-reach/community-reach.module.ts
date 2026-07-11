import { Module } from '@nestjs/common';
import { CommunityReachController } from './community-reach.controller';
import { CommunityReachService } from './community-reach.service';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [CommunityReachController],
  providers: [CommunityReachService, PrismaService],
})
export class CommunityReachModule {}
