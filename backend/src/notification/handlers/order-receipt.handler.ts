import { Injectable } from '@nestjs/common';
import { OrderCompletedEvent } from '../events/order-completed.event';

@Injectable()
export class OrderReceiptHandler {
  async handle(event: OrderCompletedEvent) {
    // TODO: Fetch order details, send receipt email
  }
}
