import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { UserConfirmedEvent } from './events/user-confirmed.event';
import { OrderCompletedEvent } from './events/order-completed.event';
import { NewsletterEvent } from './events/newsletter.event';
import { EventNotificationEvent } from './events/event-notification.event';
import { PrismaService } from '../prisma/prisma.service';

// This script emits all notification events to test real email sending.
// Make sure your .env SMTP config is set and NotificationModule is properly wired in your app for a full test.
// USE MOCK PRISMA SERVICE FOR TESTING
async function main() {
  const app = await NestFactory.createApplicationContext(NotificationModule, { logger: ['error', 'warn', 'log'] });
  // Override PrismaService with mock for testing
  const eventEmitter = app.get(EventEmitter2);

  // Simulate user registration (confirmation email)
  eventEmitter.emit(
    'user.created',
    new UserCreatedEvent('user1', '10422021@student.vgu.edu.vn', 'Test User', 'test-confirm-code')
  );

  // Simulate user confirmation (welcome email)
  eventEmitter.emit(
    'user.confirmed',
    new UserConfirmedEvent('user1', '10422021@student.vgu.edu.vn', 'Test User', new Date())
  );

  // Simulate order completion (order receipt)
  eventEmitter.emit(
    'order.completed',
    new OrderCompletedEvent('b7e2c1a4-5f3d-4e2a-9c1a-123456789abd', 'user1', '10422021@student.vgu.edu.vn')
  );

  // Simulate newsletter
  eventEmitter.emit(
    'newsletter.send',
    new NewsletterEvent(
      'Test Newsletter',
      'This is a test newsletter!',
      ['10422021@student.vgu.edu.vn'],
      new Date()
    )
  );

  // Simulate event notification
  eventEmitter.emit(
    'event.notification',
    new EventNotificationEvent(
      'event1',
      'reminder',
      'Event Reminder',
      'This is your event reminder!',
      ['10422021@student.vgu.edu.vn'],
      new Date(),
      { custom: 'data' }
    )
  );

  console.log('All events emitted. Check your inbox!');
  await app.close();
}

main().catch(console.error);
