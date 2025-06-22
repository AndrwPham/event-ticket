import { Module } from '@nestjs/common';
import { IssuedTicketService } from './issuedticket.service';
import { IssuedTicketController } from './issuedticket.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule],
  controllers: [IssuedTicketController],
  providers: [IssuedTicketService],
  exports: [IssuedTicketService],
})
export class IssuedTicketModule {}
