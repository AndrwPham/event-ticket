import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseProvider {
  async sendTicket(payload: any): Promise<void> {
    // TODO: Call Firebase function to deliver ticket
  }
}
