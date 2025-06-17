import { Controller, Post, Get, Body, Headers, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-link')
  async createLink(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPaymentLink(dto);
  }

  @Post('cancel')
  async cancel(@Body('orderCode') orderCode: string) {
    // TODO: implement more reasoning for cancellation
    return this.paymentService.cancelPaymentLink(orderCode, 'User timed out or cancelled the payment');
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Body() body: any,
  ) {
    return this.paymentService.verifyWebhook(body);
  }

  @Get('order/:orderCode')
  async getInfo(@Param('orderCode') orderCode: string) {
    return this.paymentService.getPaymentInfo(orderCode);
  }
}
