import { Module } from '@nestjs/common';
import { TicketService } from './issuedticket.service';
import { TicketController } from './issuedticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
