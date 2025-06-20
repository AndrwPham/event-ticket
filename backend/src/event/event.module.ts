import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; 
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}),AuthModule, PrismaModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
