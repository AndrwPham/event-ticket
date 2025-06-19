import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderService } from '../order/order.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { HttpStatus } from '@nestjs/common';

const mockPaymentService = {
  createPaymentLink: jest.fn(),
  cancelPaymentLink: jest.fn(),
  verifyWebhook: jest.fn(),
  getPaymentInfo: jest.fn(),
};

const mockOrderService = {
  cancel: jest.fn(),
  findOne: jest.fn(),
  confirmPayment: jest.fn(),
};

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    jest.clearAllMocks();
  });

  describe('createLink', () => {
    it('should return payment link on success', async () => {
      mockPaymentService.createPaymentLink.mockResolvedValue({ checkoutUrl: 'url' });
      const dto: CreatePaymentDto = { orderCode: 1, description: 'desc', amount: 1000, items: [], returnUrl: '', cancelUrl: '' } as any;
      const result = await controller.createLink(dto);
      expect(result).toEqual({ checkoutUrl: 'url' });
      expect(mockPaymentService.createPaymentLink).toHaveBeenCalledWith(dto);
    });
    it('should return error on failure', async () => {
      mockPaymentService.createPaymentLink.mockRejectedValue(new Error('fail'));
      const dto: CreatePaymentDto = { orderCode: 1, description: 'desc', amount: 1000, items: [], returnUrl: '', cancelUrl: '' } as any;
      const result = await controller.createLink(dto);
      expect(result).toHaveProperty('error');
    });
  });

  describe('cancel', () => {
    it('should cancel payment and order', async () => {
      mockPaymentService.cancelPaymentLink.mockResolvedValue({ status: 'CANCELLED' });
      mockOrderService.cancel.mockResolvedValue(true);
      const result = await controller.cancel('1', 'reason');
      expect(result.cancelled).toBe(true);
      expect(mockPaymentService.cancelPaymentLink).toHaveBeenCalledWith('1', 'reason');
      expect(mockOrderService.cancel).toHaveBeenCalledWith('1');
    });
    it('should handle error', async () => {
      mockPaymentService.cancelPaymentLink.mockRejectedValue(new Error('fail'));
      const result = await controller.cancel('1', 'reason');
      expect(result).toHaveProperty('error');
    });
  });

  describe('webhook', () => {
    it('should process successful payment and confirm order', async () => {
      mockPaymentService.verifyWebhook.mockResolvedValue({ code: '00', orderCode: 1 });
      mockOrderService.findOne.mockResolvedValue({ status: 'PENDING' });
      mockOrderService.confirmPayment.mockResolvedValue(true);
      const result = await controller.webhook({});
      expect(result).toEqual({ received: true });
      expect(mockOrderService.confirmPayment).toHaveBeenCalledWith('1');
    });
    it('should not confirm already paid order', async () => {
      mockPaymentService.verifyWebhook.mockResolvedValue({ code: '00', orderCode: 1 });
      mockOrderService.findOne.mockResolvedValue({ status: 'PAID' });
      const result = await controller.webhook({});
      expect(result).toEqual({ received: true });
      expect(mockOrderService.confirmPayment).not.toHaveBeenCalled();
    });
    it('should handle failed payment', async () => {
      mockPaymentService.verifyWebhook.mockResolvedValue({ code: '01', orderCode: 1 });
      const result = await controller.webhook({});
      expect(result).toEqual({ received: true });
    });
    it('should handle error in webhook', async () => {
      mockPaymentService.verifyWebhook.mockRejectedValue(new Error('fail'));
      const result = await controller.webhook({});
      expect(result).toHaveProperty('received', true);
      expect(result).toHaveProperty('error');
    });
  });

  describe('getInfo', () => {
    it('should return payment info', async () => {
      mockPaymentService.getPaymentInfo.mockResolvedValue({ status: 'PAID' });
      const result = await controller.getInfo('1');
      expect(result).toEqual({ status: 'PAID' });
    });
    it('should handle not found', async () => {
      mockPaymentService.getPaymentInfo.mockResolvedValue(undefined);
      const result = await controller.getInfo('1');
      expect(result).toHaveProperty('error');
    });
    it('should handle error', async () => {
      mockPaymentService.getPaymentInfo.mockRejectedValue(new Error('fail'));
      const result = await controller.getInfo('1');
      expect(result).toHaveProperty('error');
    });
  });
});
