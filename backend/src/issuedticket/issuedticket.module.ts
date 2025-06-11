import { Module } from '@nestjs/common';
import { IssuedTicketService } from './issuedticket.service';
import { IssuedTicketController } from './issuedticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule],
  controllers: [IssuedTicketController],
  providers: [IssuedTicketService],
})
export class IssuedTicketModule {}
