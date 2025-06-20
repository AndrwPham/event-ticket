import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { AuthConfirmationHandler } from './handlers/auth-confirmation.handler';
import { WelcomeHandler } from './handlers/welcome.handler';
import { OrderReceiptHandler } from './handlers/order-receipt.handler';
import { TicketDeliveryHandler } from './handlers/ticket-delivery.handler';
import { NewsletterHandler } from './handlers/newsletter.handler';
import { EmailProvider } from './providers/email.provider';
import { FirebaseProvider } from './providers/firebase.provider';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    NotificationService,
    AuthConfirmationHandler,
    WelcomeHandler,
    OrderReceiptHandler,
    TicketDeliveryHandler,
    NewsletterHandler,
    EmailProvider,
    FirebaseProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
