import { Injectable } from '@nestjs/common';
import { OrderCompletedEvent } from '../events/order-completed.event';

@Injectable()
export class TicketDeliveryHandler {
  async handle(event: OrderCompletedEvent) {
    // TODO: Call Firebase function to deliver ticket
  }
}
