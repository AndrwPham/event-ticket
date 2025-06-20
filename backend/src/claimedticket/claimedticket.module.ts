import { Module } from '@nestjs/common';
import { ClaimedTicketService } from './claimedticket.service';
import { ClaimedTicketController } from './claimedticket.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule],
  controllers: [ClaimedTicketController],
  providers: [ClaimedTicketService],
})
export class ClaimedTicketModule {}
