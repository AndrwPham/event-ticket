import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailProvider {
  private readonly logger = new Logger(EmailProvider.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
        text,
      });
      this.logger.log(`Email sent to ${to} (subject: ${subject})`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      throw err;
    }
  }
}
