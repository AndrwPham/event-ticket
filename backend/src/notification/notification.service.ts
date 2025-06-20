import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { UserConfirmedEvent } from './events/user-confirmed.event';
import { OrderCompletedEvent } from './events/order-completed.event';
import { NewsletterEvent } from './events/newsletter.event';
import { EventNotificationEvent } from './events/event-notification.event';
import { AuthConfirmationHandler } from './handlers/auth-confirmation.handler';
import { WelcomeHandler } from './handlers/welcome.handler';
import { OrderReceiptHandler } from './handlers/order-receipt.handler';
import { TicketDeliveryHandler } from './handlers/ticket-delivery.handler';
import { NewsletterHandler } from './handlers/newsletter.handler';
import { EventNotificationHandler } from './handlers/event-notification.handler';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly authConfirmationHandler: AuthConfirmationHandler,
    private readonly welcomeHandler: WelcomeHandler,
    private readonly orderReceiptHandler: OrderReceiptHandler,
    private readonly ticketDeliveryHandler: TicketDeliveryHandler,
    private readonly newsletterHandler: NewsletterHandler,
    private readonly eventNotificationHandler: EventNotificationHandler,
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.log(`Handling user.created event for user ${event.email}`);
    await this.authConfirmationHandler.handle(event);
  }

  @OnEvent('user.confirmed')
  async handleUserConfirmed(event: UserConfirmedEvent) {
    this.logger.log(`Handling user.confirmed event for user ${event.email}`);
    await this.welcomeHandler.handle(event);
  }

  @OnEvent('order.completed')
  async handleOrderCompleted(event: OrderCompletedEvent) {
    this.logger.log(`Handling order.completed event for order ${event.orderId}`);
    await this.orderReceiptHandler.handle(event);
    await this.ticketDeliveryHandler.handle(event);
  }

  @OnEvent('newsletter.send')
  async handleNewsletter(event: NewsletterEvent) {
    this.logger.log(`Handling newsletter.send event for subject ${event.subject}`);
    await this.newsletterHandler.handle(event);
  }

  @OnEvent('event.notification')
  async handleEventNotification(event: EventNotificationEvent) {
    this.logger.log(`Handling event.notification event for event ${event.eventId} type ${event.type}`);
    await this.eventNotificationHandler.handle(event);
  }
}
