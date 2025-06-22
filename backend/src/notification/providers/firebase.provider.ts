import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FirebaseProvider {
  private readonly logger = new Logger(FirebaseProvider.name);

  async sendTicket(payload: any): Promise<void> {
    const firebaseUrl = process.env.FIREBASE_TICKET_URL || '';
    const apiKey = process.env.EMAIL_API_KEY || '';
    if (!firebaseUrl || !apiKey) {
      this.logger.error('FIREBASE_TICKET_URL or EMAIL_API_KEY is not set');
      throw new Error('Missing Firebase function URL or API key');
    }
    try {
      await axios.post(
        `${firebaseUrl}/api/tickets/email`,
        payload,
        {
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      this.logger.log(`Ticket sent to Firebase for ${payload.email}`);
    } catch (err) {
      this.logger.error(`Failed to send ticket to Firebase: ${err.message}`);
      throw err;
    }
  }
}
