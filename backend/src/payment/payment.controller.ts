import { Controller, Post, Get, Body, Headers, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) { }

  @Post('create-payment-link')
  async createLink(@Body() dto: CreatePaymentDto) {
    this.logger.log(`Creating payment link for order code: ${dto.orderCode}`);
    const paymentLink = await this.paymentService.createPaymentLink(dto);
    return paymentLink;
  }

  @Post('cancel')
  async cancel(@Body('orderCode') orderCode: string) {
    await this.logger.warn(`Cancelling payment link for order code: ${orderCode}`);
    const cancelResult = await this.paymentService.cancelPaymentLink(orderCode, 'User cancelled the payment');
    await this.orderService.cancel(orderCode);
    return {cancelled: true, data: cancelResult};
  }

  // TODO: read webhook code
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Headers('x-payos-signature') signature: string,
    @Body() body: any,
  ) {
    return this.paymentService.verifyWebhook(body);
  }

  @Get('order/:orderCode')
  async getInfo(@Param('orderCode') orderCode: string) {
    this.logger.log(`Retrieving payment info for order code: ${orderCode}`);
    const info = await this.paymentService.getPaymentInfo(orderCode);
    if (!info) {
      this.logger.warn(`No payment info found for order code: ${orderCode}`);
      return { error: 'Payment info not found' };
    }
    return info;
  }
}
