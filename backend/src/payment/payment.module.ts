import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payment.controller';
import {OrderModule} from "../order/order.module";

console.log('OrderModule:', OrderModule);

@Module({
  imports: [ConfigModule, forwardRef(() => OrderModule)],
  providers: [PaymentService],
  controllers: [PaymentsController],
  exports: [PaymentService],
})
export class PaymentModule {}