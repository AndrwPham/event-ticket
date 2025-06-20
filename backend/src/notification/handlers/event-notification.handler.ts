import { Injectable } from '@nestjs/common';
import { EventNotificationEvent } from '../events/event-notification.event';

@Injectable()
export class EventNotificationHandler {
  async handle(event: EventNotificationEvent) {
    // TODO: Send transactional event notification to recipients
  }
}
