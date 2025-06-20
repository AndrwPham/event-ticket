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
    // {
    //   provide: PrismaService,
    //   useValue: {
    //     order: {
    //       findUnique: async ({ where }) => ({
    //         id: where.id,
    //         createdAt: new Date(),
    //         method: 'Credit Card',
    //         totalPrice: 123.45,
    //         attendee: {
    //           first_name: 'Test',
    //           last_name: 'User',
    //           email: '10422021@student.vgu.edu.vn',
    //         },
    //         ticketItems: [
    //           { name: 'VIP Ticket', price: 100, quantity: 1 },
    //           { name: 'Standard Ticket', price: 23.45, quantity: 1 },
    //         ],
    //         tickets: [
    //           { id: 't1', seat: 'A1' },
    //           { id: 't2', seat: 'A2' },
    //         ],
    //       }),
    //     },
    //   },
    // },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
