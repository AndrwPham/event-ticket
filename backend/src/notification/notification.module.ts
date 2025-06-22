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
    PrismaService,  // uncomment if testing with mocked data
    // Mock ClaimedTicketService for testing
    {
      provide: require('../claimedticket/claimedticket.service').ClaimedTicketService,
      useValue: {
        findByOrder: async (orderId: string) => [
          {
            issuedTicket: {
              id: 'ABC123',
              class: 'VIP',
              seat: 'A1',
              eventId: 'event1',
              price: 100,
            },
            attendee: {
              email: '10422021@student.vgu.edu.vn',
              first_name: 'Test',
              last_name: 'User',
            },
            status: 'READY',
          },
        ],
      },
    },
    // Mock IssuedTicketService for testing
    {
      provide: require('../issuedticket/issuedticket.service').IssuedTicketService,
      useValue: {},
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
