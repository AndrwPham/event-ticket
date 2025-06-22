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
import { IssuedTicketService } from 'src/issuedticket/issuedticket.service';
import { PaymentService } from 'src/payment/payment.service';
import { ClaimedTicketService } from 'src/claimedticket/claimedticket.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule, IssuedTicketModule, ClaimedTicketModule, RedisModule],
  controllers: [OrderController],
  providers: [OrderService, HoldService, IssuedTicketService, PaymentService, ClaimedTicketService, ConfigService],
  exports: [OrderService],
})
export class OrderModule {}
