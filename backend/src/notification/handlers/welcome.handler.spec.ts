import { WelcomeHandler } from './welcome.handler';
import { EmailProvider } from '../providers/email.provider';
import { UserConfirmedEvent } from '../events/user-confirmed.event';

describe('WelcomeHandler', () => {
  let handler: WelcomeHandler;
  let emailProvider: EmailProvider;

  beforeEach(() => {
    emailProvider = { sendEmail: jest.fn() } as any;
    handler = new WelcomeHandler(emailProvider);
  });

  it('should send a welcome email', async () => {
    await handler.handle(new UserConfirmedEvent('user1', 'test@example.com', 'Test', new Date()));
    expect(emailProvider.sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.stringContaining('Welcome'),
      expect.any(String),
      expect.any(String)
    );
  });
});
