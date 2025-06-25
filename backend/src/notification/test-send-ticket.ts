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
    code: 'b7e2c1a4-5f3d-4e2a-9c1a-123456789abd', // Simulated ticket UUID
    serial: 'b7e2c1a4-5f3d-4e2a-9c1a-123456789abd', // Simulated ticket UUID
    class: 'VVIP',
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
