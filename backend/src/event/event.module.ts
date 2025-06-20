import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; 
import { JwtModule } from '@nestjs/jwt';
import { IssuedTicketService } from 'src/issuedticket/issuedticket.service';

@Module({
  imports: [JwtModule.register({}),AuthModule, PrismaModule],
  providers: [EventService, IssuedTicketService],
  controllers: [EventController],
})
export class EventModule {}
