import { Injectable } from '@nestjs/common';
import { EventNotificationEvent } from '../events/event-notification.event';
import { EmailProvider } from '../providers/email.provider';
import { renderTemplateFromFile } from './template.helper';

@Injectable()
export class EventNotificationHandler {
  constructor(private readonly emailProvider: EmailProvider) {}

  async handle(event: EventNotificationEvent) {
    const templateData = { ...event.metadata, content: event.content };
    const subject = event.subject;
    const html = renderTemplateFromFile('event-notification', templateData, 'html');
    const text = renderTemplateFromFile('event-notification', templateData, 'txt');
    for (const recipient of event.recipients) {
      await this.emailProvider.sendEmail(recipient, subject, html, text);
    }
  }
}
