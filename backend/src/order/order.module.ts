import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { IssuedTicketModule } from '../issuedticket/issuedticket.module';
import { ClaimedTicketModule } from '../claimedticket/claimedticket.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { HoldService } from './hold.service';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule, IssuedTicketModule, ClaimedTicketModule, RedisModule, forwardRef(() => PaymentModule),],
  controllers: [OrderController],
  providers: [OrderService, HoldService],
  exports: [OrderService],
})
export class OrderModule {}
