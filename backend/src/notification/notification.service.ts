import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { OrderCompletedEvent } from './events/order-completed.event';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.log(`Handling user.created event for user ${event.email}`);
    // TODO: call welcome handler, send confirmation link, etc.
  }

  @OnEvent('order.completed')
  async handleOrderCompleted(event: OrderCompletedEvent) {
    this.logger.log(`Handling order.completed event for order ${event.orderId}`);
    // TODO: call order receipt handler, ticket delivery handler, etc.
  }
}
