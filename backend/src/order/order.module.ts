import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { IssuedTicketModule } from 'src/issuedticket/issuedticket.module';
import { ClaimedTicketModule } from 'src/claimedticket/claimedticket.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { HoldService } from './hold.service';

@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule, IssuedTicketModule, ClaimedTicketModule, RedisModule],
  controllers: [OrderController],
  providers: [OrderService, HoldService],
  exports: [OrderService],
})
export class OrderModule {}
