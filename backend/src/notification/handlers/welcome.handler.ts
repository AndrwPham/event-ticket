import { Injectable } from '@nestjs/common';
import { UserConfirmedEvent } from '../events/user-confirmed.event';
import { EmailProvider } from '../providers/email.provider';
import { renderTemplateFromFile } from './template.helper';

@Injectable()
export class WelcomeHandler {
  constructor(private readonly emailProvider: EmailProvider) {}

  async handle(event: UserConfirmedEvent) {
    if (!event.email) throw new Error('Missing email for welcome notification');
    const templateData = { name: event.name };
    const subject = 'Welcome to Event Ticket!';
    const html = renderTemplateFromFile('welcome', templateData, 'html');
    const text = renderTemplateFromFile('welcome', templateData, 'txt');
    await this.emailProvider.sendEmail(event.email, subject, html, text);
  }
}
