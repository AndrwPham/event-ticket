import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailProvider {
  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
    // TODO: Integrate with email service (e.g., SMTP, SendGrid, SES)
  }
}
