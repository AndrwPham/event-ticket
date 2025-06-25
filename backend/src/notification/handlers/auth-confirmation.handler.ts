import { Injectable } from '@nestjs/common';
import { UserCreatedEvent } from '../events/user-created.event';
import { EmailProvider } from '../providers/email.provider';
import { renderTemplateFromFile } from './template.helper';

@Injectable()
export class AuthConfirmationHandler {
  constructor(private readonly emailProvider: EmailProvider) {}

  async handle(event: UserCreatedEvent) {
    if (!event.confirmationCode) throw new Error('Missing confirmation code');
    const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:5000';
    const confirmationLink = `${baseUrl}/auth/confirm?token=${encodeURIComponent(event.confirmationCode)}`;
    const templateData = { name: event.name, confirmationLink };
    const subject = 'Confirm your account';
    const html = renderTemplateFromFile('auth-confirmation', templateData, 'html');
    const text = renderTemplateFromFile('auth-confirmation', templateData, 'txt');
    await this.emailProvider.sendEmail(event.email, subject, html, text);
  }
}
