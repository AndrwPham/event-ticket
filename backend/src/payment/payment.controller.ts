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
  async webhook(@Body() body: any) {
    try {
      // parse webhook data
      const webhookData = await this.paymentService.verifyWebhook(body);
      if (!webhookData || webhookData.code !== '00') {
        this.logger.warn(`Payment failed or not successful for order: ${webhookData?.orderCode}`);
        return { received: true };
      }

      // idempotency check
      const orderId = String(webhookData.orderCode);
      const order = await this.orderService.findOne(orderId);
      if (order && order.status === 'PAID') {
        this.logger.log(`Order ${orderId} already processed.`);
        return { received: true };
      }

      // confirm payment and claim tickets
      await this.orderService.confirmPayment(orderId);
      this.logger.log(`Order ${orderId} marked as PAID and tickets claimed.`);
      return { received: true };
    } catch (error) {
      this.logger.error('Webhook processing failed', error);

      // achknowledge receipt of the webhook
      return { received: true, error: error.message };
    }
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
