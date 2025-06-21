import { AuthConfirmationHandler } from './auth-confirmation.handler';
import { EmailProvider } from '../providers/email.provider';
import { UserCreatedEvent } from '../events/user-created.event';

describe('AuthConfirmationHandler', () => {
  let handler: AuthConfirmationHandler;
  let emailProvider: EmailProvider;

  beforeEach(() => {
    emailProvider = { sendEmail: jest.fn() } as any;
    handler = new AuthConfirmationHandler(emailProvider);
  });

  it('should send a confirmation email', async () => {
    await handler.handle(new UserCreatedEvent('user1', 'test@example.com', 'Test', 'code123'));
    expect(emailProvider.sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.stringContaining('Confirm your account'),
      expect.any(String),
      expect.any(String)
    );
  });
});
