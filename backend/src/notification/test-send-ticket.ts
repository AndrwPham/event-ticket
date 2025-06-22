import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { FirebaseProvider } from './providers/firebase.provider';

async function main() {
  const app = await NestFactory.createApplicationContext(NotificationModule, { logger: ['error', 'warn', 'log'] });
  const firebaseProvider = app.get(FirebaseProvider);

  // Mock ticket data
  const payload = {
    email: '10422021@student.vgu.edu.vn',
    name: 'Test User',
    code: 'ABC123',      // Must be 6 alphanumeric chars
    serial: 'ABC123',
    class: 'VIP',
    seat: 'A1',
    event: 'event1',
    price: 100,
    status: 'READY',
  };

  await firebaseProvider.sendTicket(payload);
  console.log('Ticket send triggered! Check your inbox.');
  await app.close();
}

main().catch(console.error);
