import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order/order.service';
import { PaymentService } from './payment/payment.service';
import { IssuedTicketService } from './issuedticket/issuedticket.service';
import { ClaimedTicketService } from './claimedticket/claimedticket.service';
import { PrismaService } from './prisma/prisma.service';
import { HoldService } from './order/hold.service';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from './order/order-status.enum';
import { TicketStatus } from './issuedticket/ticket-status.enum';
import { ClaimedTicketStatus } from './claimedticket/claimedticket-status.enum';

// Mock PayOS SDK
const mockPayOS = {
  createPaymentLink: jest.fn(),
  getPaymentLinkInformation: jest.fn(),
  cancelPaymentLink: jest.fn(),
  verifyPaymentWebhookData: jest.fn(),
};
jest.mock('@payos/node', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockPayOS),
}));

// Mock Prisma for all services
const mockPrisma = {
  $transaction: jest.fn(),
  issuedTicket: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
  claimedTicket: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  order: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
};

const mockHoldService = { holdTickets: jest.fn(), releaseTickets: jest.fn() };

const configService = {
  get: jest.fn((key: string) => {
    if (key === 'PAYOS_CLIENT_ID') return 'clientId';
    if (key === 'PAYOS_API_KEY') return 'apiKey';
    if (key === 'PAYOS_CHECKSUM_KEY') return 'checksumKey';
    if (key === 'FRONTEND_BASE_URL') return 'https://frontend';
    return undefined;
  }),
};

describe('Full Buy Flow Integration', () => {
  let orderService: OrderService;
  let paymentService: PaymentService;
  let issuedTicketService: IssuedTicketService;
  let claimedTicketService: ClaimedTicketService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        PaymentService,
        IssuedTicketService,
        ClaimedTicketService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: HoldService, useValue: mockHoldService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    orderService = module.get<OrderService>(OrderService);
    paymentService = module.get<PaymentService>(PaymentService);
    issuedTicketService = module.get<IssuedTicketService>(IssuedTicketService);
    claimedTicketService = module.get<ClaimedTicketService>(ClaimedTicketService);
  });

  it('should run the full buy flow: issue, order, pay, claim', async () => {
    // 1. Issue tickets
    const ticket1 = { id: 't1', price: 100, status: TicketStatus.AVAILABLE };
    const ticket2 = { id: 't2', price: 200, status: TicketStatus.AVAILABLE };
    mockPrisma.issuedTicket.findUnique.mockImplementation(({ where }) => {
      if (where.id === 't1') return Promise.resolve(ticket1);
      if (where.id === 't2') return Promise.resolve(ticket2);
      return Promise.resolve(undefined);
    });
    let txObj: any = undefined;
    // Mock $transaction to provide a tx object with claimedTicket.createMany
    mockPrisma.$transaction.mockImplementation(async (cb) => {
      const tx = {
        order: {
          create: jest.fn().mockResolvedValue({ id: 'order1', ticketItems: ['t1', 't2'], status: OrderStatus.PENDING, attendeeId: 'u1' }),
          update: jest.fn(),
        },
        issuedTicket: {
          update: jest.fn().mockResolvedValue({}),
          updateMany: jest.fn(),
        },
        claimedTicket: {
          createMany: jest.fn().mockResolvedValue({ count: 2 }),
        },
      };
      txObj = tx;
      return cb(tx);
    });
    mockPrisma.claimedTicket.createMany.mockResolvedValue({ count: 2 });
    mockHoldService.holdTickets.mockResolvedValue(undefined);
    mockHoldService.releaseTickets.mockResolvedValue(undefined);
    mockPrisma.order.create.mockResolvedValue({ id: 'order1', ticketItems: ['t1', 't2'], status: OrderStatus.PENDING, attendeeId: 'u1' });
    mockPrisma.order.findUnique.mockResolvedValue({ id: 'order1', status: OrderStatus.PENDING, attendeeId: 'u1', ticketItems: ['t1', 't2'] });
    mockPayOS.createPaymentLink.mockResolvedValue({ checkoutUrl: 'http://payos.link' });
    mockPrisma.order.update.mockResolvedValue({ id: 'order1', status: OrderStatus.PAID });
    // 5. Claim tickets
    const createDto = { userId: 'u1', ticketItems: ['t1', 't2'], method: 'card' };
    const orderResult = await orderService.create(createDto);
    expect(orderResult.order).toEqual({ id: 'order1', ticketItems: ['t1', 't2'], status: OrderStatus.PENDING, attendeeId: 'u1' });
    expect(orderResult.paymentLink.checkoutUrl).toBe('http://payos.link');
    // Simulate payment confirmation
    mockPrisma.order.findUnique
      .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PENDING, attendeeId: 'u1', ticketItems: ['t1', 't2'] })
      .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PAID });
    const confirmResult = await orderService.confirmPayment('order1');
    expect(confirmResult).toEqual({ id: 'order1', status: OrderStatus.PAID });
    // Check claimed tickets (on the tx object)
    expect(txObj.claimedTicket.createMany).toHaveBeenCalledWith({
      data: [
        { id: 't1', orderId: 'order1', attendeeId: 'u1', status: ClaimedTicketStatus.READY },
        { id: 't2', orderId: 'order1', attendeeId: 'u1', status: ClaimedTicketStatus.READY },
      ],
    });
  });
});
