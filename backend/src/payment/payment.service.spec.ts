import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';

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

describe('PaymentService', () => {
  let service: PaymentService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'PAYOS_CLIENT_ID') return 'clientId';
        if (key === 'PAYOS_API_KEY') return 'apiKey';
        if (key === 'PAYOS_CHECKSUM_KEY') return 'checksumKey';
        return undefined;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment link', async () => {
    mockPayOS.createPaymentLink.mockResolvedValue({ checkoutUrl: 'url' });
    const dto = {
      orderCode: 1,
      description: 'desc',
      amount: 1000,
      items: [{ name: 'item', price: 1000, quantity: 1 }],
      returnUrl: 'https://return',
      cancelUrl: 'https://cancel',
    };
    const result = await service.createPaymentLink(dto);
    expect(mockPayOS.createPaymentLink).toHaveBeenCalledWith(expect.objectContaining({ orderCode: 1 }));
    expect(result.checkoutUrl).toBe('url');
  });

  it('should get payment info', async () => {
    mockPayOS.getPaymentLinkInformation.mockResolvedValue({ status: 'PAID' });
    const result = await service.getPaymentInfo('1');
    expect(mockPayOS.getPaymentLinkInformation).toHaveBeenCalledWith('1');
    expect(result.status).toBe('PAID');
  });

  it('should cancel payment link', async () => {
    mockPayOS.cancelPaymentLink.mockResolvedValue({ status: 'CANCELLED' });
    const result = await service.cancelPaymentLink('1', 'reason');
    expect(mockPayOS.cancelPaymentLink).toHaveBeenCalledWith('1', 'reason');
    expect(result.status).toBe('CANCELLED');
  });

  it('should verify webhook and return parsed data', async () => {
    mockPayOS.verifyPaymentWebhookData.mockResolvedValue({ code: '00', data: { orderCode: 1 } });
    const result = await service.verifyWebhook({});
    expect(mockPayOS.verifyPaymentWebhookData).toHaveBeenCalled();
    expect(result.code).toBe('00');
  });

  it('should throw on createPaymentLink error', async () => {
    mockPayOS.createPaymentLink.mockRejectedValue(new Error('fail'));
    await expect(service.createPaymentLink({} as any)).rejects.toThrow('Failed to create payment link');
  });

  it('should throw on getPaymentInfo error', async () => {
    mockPayOS.getPaymentLinkInformation.mockRejectedValue(new Error('fail'));
    await expect(service.getPaymentInfo('1')).rejects.toThrow('Failed to get payment information');
  });

  it('should throw on cancelPaymentLink error', async () => {
    mockPayOS.cancelPaymentLink.mockRejectedValue(new Error('fail'));
    await expect(service.cancelPaymentLink('1', 'reason')).rejects.toThrow('Failed to cancel payment link');
  });

  it('should throw on verifyWebhook error', async () => {
    mockPayOS.verifyPaymentWebhookData.mockRejectedValue(new Error('fail'));
    await expect(service.verifyWebhook({})).rejects.toThrow('Failed to verify webhook');
  });

  it('should pass through all optional fields to createPaymentLink', async () => {
    mockPayOS.createPaymentLink.mockResolvedValue({ checkoutUrl: 'url' });
    const dto = {
      orderCode: 2,
      description: 'desc',
      amount: 2000,
      items: [{ name: 'item2', price: 2000, quantity: 2 }],
      returnUrl: 'https://return',
      cancelUrl: 'https://cancel',
      buyerName: 'Test User',
      buyerEmail: 'test@example.com',
      buyerPhone: '123456789',
      buyerAddress: '123 Test St',
      expiredAt: 1234567890,
    };
    await service.createPaymentLink(dto);
    expect(mockPayOS.createPaymentLink).toHaveBeenCalledWith(expect.objectContaining({
      buyerName: 'Test User',
      buyerEmail: 'test@example.com',
      buyerPhone: '123456789',
      buyerAddress: '123 Test St',
      expiredAt: 1234567890,
    }));
  });

  it('should handle missing optional fields gracefully', async () => {
    mockPayOS.createPaymentLink.mockResolvedValue({ checkoutUrl: 'url' });
    const dto = {
      orderCode: 3,
      description: 'desc',
      amount: 3000,
      items: [{ name: 'item3', price: 3000, quantity: 3 }],
      returnUrl: 'https://return',
      cancelUrl: 'https://cancel',
    };
    const result = await service.createPaymentLink(dto);
    expect(result.checkoutUrl).toBe('url');
    expect(mockPayOS.createPaymentLink).toHaveBeenCalledWith(expect.not.objectContaining({ buyerName: expect.anything() }));
  });

  it('should throw InternalServerErrorException if PayOS config is missing', async () => {
    const BrokenPaymentService = (await import('./payment.service')).PaymentService;
    const brokenConfig = { get: jest.fn(() => undefined) } as any;
    expect(() => new BrokenPaymentService(brokenConfig)).toThrow('Missing PayOS configuration');
  });
});
