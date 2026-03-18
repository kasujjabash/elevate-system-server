import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HubsService } from './hubs.service';
import { HubsController } from './hubs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaService } from '../shared/prisma.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([])],
  providers: [HubsService, PrismaService],
  controllers: [HubsController],
  exports: [HubsService],
})
export class HubsModule {}
