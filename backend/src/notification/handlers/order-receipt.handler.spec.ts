import { OrderReceiptHandler } from './order-receipt.handler';
import { EmailProvider } from '../providers/email.provider';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderCompletedEvent } from '../events/order-completed.event';

describe('OrderReceiptHandler', () => {
  let handler: OrderReceiptHandler;
  let emailProvider: EmailProvider;
  let prisma: PrismaService;

  beforeEach(() => {
    emailProvider = { sendEmail: jest.fn() } as any;
    prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'order123',
          attendee: { email: 'test@example.com', first_name: 'Test' },
          createdAt: new Date('2025-06-20T12:00:00Z'),
          method: 'card',
          totalPrice: 100,
          ticketItems: ['A', 'B'],
        }),
      },
    } as any;
    handler = new OrderReceiptHandler(emailProvider, prisma);
  });

  it('should send a receipt email', async () => {
    await handler.handle(new OrderCompletedEvent('order123', 'userId'));
    expect(emailProvider.sendEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.stringContaining('Your Order Receipt'),
      expect.any(String),
      expect.any(String)
    );
  });
});
