import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { AuthConfirmationHandler } from './handlers/auth-confirmation.handler';
import { WelcomeHandler } from './handlers/welcome.handler';
import { OrderReceiptHandler } from './handlers/order-receipt.handler';
import { TicketDeliveryHandler } from './handlers/ticket-delivery.handler';
import { NewsletterHandler } from './handlers/newsletter.handler';
import { EventNotificationHandler } from './handlers/event-notification.handler';
import { EmailProvider } from './providers/email.provider';
import { FirebaseProvider } from './providers/firebase.provider';
import { PrismaService } from '../prisma/prisma.service';
import { ClaimedTicketService } from '../claimedticket/claimedticket.service';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    NotificationService,
    AuthConfirmationHandler,
    WelcomeHandler,
    OrderReceiptHandler,
    TicketDeliveryHandler,
    NewsletterHandler,
    EventNotificationHandler,
    EmailProvider,
    FirebaseProvider,
    PrismaService,
    ClaimedTicketService,
    IssuedTicketService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
