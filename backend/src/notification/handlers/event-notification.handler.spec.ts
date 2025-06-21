import { EventNotificationHandler } from './event-notification.handler';
import { EmailProvider } from '../providers/email.provider';
import { EventNotificationEvent } from '../events/event-notification.event';

describe('EventNotificationHandler', () => {
  let handler: EventNotificationHandler;
  let emailProvider: EmailProvider;

  beforeEach(() => {
    emailProvider = { sendEmail: jest.fn() } as any;
    handler = new EventNotificationHandler(emailProvider);
  });

  it('should send event notifications to all recipients', async () => {
    const event = new EventNotificationEvent(
      'event1',
      'reminder',
      'Event Reminder',
      'This is your reminder!',
      ['a@example.com', 'b@example.com'],
      new Date(),
      { custom: 'data' }
    );
    await handler.handle(event);
    expect(emailProvider.sendEmail).toHaveBeenCalledTimes(2);
    expect(emailProvider.sendEmail).toHaveBeenCalledWith(
      'a@example.com',
      expect.stringContaining('Event Reminder'),
      expect.any(String),
      expect.any(String)
    );
  });
});
