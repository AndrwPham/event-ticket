import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payment.controller';

@Module({
  imports: [ConfigModule],
  providers: [PaymentService],
  controllers: [PaymentsController],
  exports: [PaymentService],
})
export class PaymentModule {}