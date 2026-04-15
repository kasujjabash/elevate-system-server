import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatController } from './chat.controller';
import { VendorModule } from 'src/vendor/vendor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appEntities } from 'src/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../shared/prisma.service';

@Module({
  imports: [
    VendorModule,
    HttpModule,
    TypeOrmModule.forFeature([...appEntities]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRoomsService, PrismaService],
})
export class ChatModule {}
