import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { HoldService } from './hold.service';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { ClaimedTicketService } from '../claimedticket/claimedticket.service';
import { PaymentService } from '../payment/payment.service';
import { OrderStatus } from './order-status.enum';
import { TicketStatus } from '../issuedticket/ticket-status.enum';
import { ClaimedTicketStatus } from '../claimedticket/claimedticket-status.enum';
import { ConfigService } from '@nestjs/config';

const mockPrisma = {
  $transaction: jest.fn(),
  order: { update: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
};
const mockHoldService = { holdTickets: jest.fn(), releaseTickets: jest.fn() };
const mockIssuedTicketService = { update: jest.fn(), findOne: jest.fn() };
const mockClaimedTicketService = { createClaimedTickets: jest.fn() };
const mockPaymentService = { createPaymentLink: jest.fn() };

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: HoldService, useValue: mockHoldService },
        { provide: IssuedTicketService, useValue: mockIssuedTicketService },
        { provide: ClaimedTicketService, useValue: mockClaimedTicketService },
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });

  describe('create', () => {
    it('should create an order, hold tickets, and return payment link (no claimed tickets yet)', async () => {
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      mockIssuedTicketService.update.mockResolvedValue({});
      mockPaymentService.createPaymentLink.mockResolvedValue('http://pay.link');
      mockIssuedTicketService.findOne.mockImplementation((id) => {
        if (id === 't1') return Promise.resolve({ id: 't1', price: 100, status: TicketStatus.AVAILABLE });
        if (id === 't2') return Promise.resolve({ id: 't2', price: 200, status: TicketStatus.AVAILABLE });
        return Promise.resolve(undefined);
      });
      const tx = {
        order: { create: jest.fn().mockResolvedValue({ id: 'order1', ticketItems: ['t1', 't2'] }), update: jest.fn() },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
      };
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(tx));
      const dto = { userId: 'u1', ticketItems: ['t1', 't2'], method: 'card' };
      const result = await service.create(dto);
      expect(mockPaymentService.createPaymentLink).toHaveBeenCalled();
      expect(mockHoldService.holdTickets).toHaveBeenCalledWith(['t1', 't2'], 'u1');
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t1', { status: TicketStatus.HELD }, tx);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t2', { status: TicketStatus.HELD }, tx);
      expect(result && result.order).toEqual({ id: 'order1', ticketItems: ['t1', 't2'] });
      expect(result && result.paymentLink).toBe('http://pay.link');
    });

    it('should throw if no ticket items provided', async () => {
      await expect(service.create({ userId: 'u1', ticketItems: [], method: 'card' })).rejects.toThrow();
    });

    it('should handle transaction error and release tickets', async () => {
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      // Mock ticket as AVAILABLE
      mockIssuedTicketService.findOne.mockResolvedValue({ id: 't1', price: 100, status: TicketStatus.AVAILABLE });
      mockPrisma.$transaction.mockRejectedValue(new Error('fail'));
      mockHoldService.releaseTickets.mockResolvedValue(undefined);
      const dto = { userId: 'u1', ticketItems: ['t1'], method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Failed to create order');
      expect(mockHoldService.releaseTickets).toHaveBeenCalledWith(['t1']);
    });

    it('should handle payment failure and rollback', async () => {
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      const tx = {
        order: { create: jest.fn().mockResolvedValue({ id: 'order1' }), update: jest.fn() },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
      };
      mockPrisma.$transaction
        .mockImplementationOnce(async (cb) => cb(tx))
        .mockImplementationOnce(async (cb) => cb(tx));
      mockIssuedTicketService.update.mockResolvedValue({});
      mockPaymentService.createPaymentLink.mockRejectedValue(new Error('fail'));
      mockIssuedTicketService.findOne.mockResolvedValue({ id: 't1', price: 100, status: TicketStatus.AVAILABLE });
      mockHoldService.releaseTickets.mockResolvedValue(undefined);
      const dto = { userId: 'u1', ticketItems: ['t1'], method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Failed to initiate payment');
      expect(mockHoldService.releaseTickets).toHaveBeenCalledWith(['t1']);
      expect(tx.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.FAILED } });
      // No claimedTicket.deleteMany call expected
    });

    it('should throw if client tries to tamper with price (fraud check)', async () => {
      mockIssuedTicketService.findOne
        .mockResolvedValueOnce({ id: 't1', price: 100, status: TicketStatus.AVAILABLE })
        .mockResolvedValueOnce({ id: 't2', price: 200, status: TicketStatus.AVAILABLE });
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      const tx = {
        order: { create: jest.fn().mockResolvedValue({ id: 'order1' }) },
        claimedTicket: { createMany: jest.fn().mockResolvedValue({ count: 2 }), deleteMany: jest.fn() },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
      };
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(tx));
      mockClaimedTicketService.createClaimedTickets.mockResolvedValue({ count: 2 });
      mockIssuedTicketService.update.mockResolvedValue({});
      mockPaymentService.createPaymentLink.mockResolvedValue('http://pay.link');
      // Simulate client tries to pass a wrong price (should be ignored)
      const dto = { userId: 'u1', ticketItems: ['t1', 't2'], method: 'card', totalPrice: 1 };
      const result = await service.create(dto);
      expect(result && result.order).toBeDefined();
      // The backend should calculate the correct price (100+200=300)
      expect(tx.order.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ totalPrice: 300 }) }));
    });

    it('should throw if any ticket is not available (fraud check)', async () => {
      mockIssuedTicketService.findOne.mockResolvedValueOnce({ id: 't1', price: 100, status: TicketStatus.HELD });
      const dto = { userId: 'u1', ticketItems: ['t1'], method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('not available for sale');
    });

    it('should throw if total price is zero or negative (fraud check)', async () => {
      mockIssuedTicketService.findOne.mockResolvedValueOnce({ id: 't1', price: 0, status: TicketStatus.AVAILABLE });
      const dto = { userId: 'u1', ticketItems: ['t1'], method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Order total must be greater than zero');
    });
  });

  describe('cancel', () => {
    it('should update order status to CANCELLED', async () => {
      // Mock order as PENDING
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order1', status: OrderStatus.PENDING });
      mockPrisma.order.update.mockResolvedValue({ id: 'order1', status: OrderStatus.CANCELLED });
      const result = await service.cancel('order1');
      expect(mockPrisma.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.CANCELLED } });
      expect(result.status).toBe(OrderStatus.CANCELLED);
    });
  });

  describe('confirmPayment', () => {
    it('should claim tickets and update order status to PAID after payment', async () => {
      // Mock order as PENDING with ticketItems
      mockPrisma.order.findUnique
        .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PENDING, attendeeId: 'u1', ticketItems: ['t1', 't2'] })
        .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PAID }); // After update
      const tx = {
        claimedTicket: { createMany: jest.fn().mockResolvedValue({ count: 2 }) },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
        order: { update: jest.fn().mockResolvedValue({ id: 'order1', status: OrderStatus.PAID }) },
      };
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(tx));
      mockHoldService.releaseTickets.mockResolvedValue(undefined);
      const result = await service.confirmPayment('order1');
      expect(mockClaimedTicketService.createClaimedTickets).toHaveBeenCalledWith('order1', 'u1', ['t1', 't2'], ClaimedTicketStatus.READY, tx);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t1', { status: TicketStatus.CLAIMED }, tx);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t2', { status: TicketStatus.CLAIMED }, tx);
      expect(tx.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.PAID } });
      expect(mockHoldService.releaseTickets).toHaveBeenCalledWith(['t1', 't2']);
      expect(result).toEqual({ id: 'order1', status: OrderStatus.PAID });
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([{ id: 'order1' }]);
      const result = await service.findAll();
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({ include: { tickets: true } });
      expect(result).toEqual([{ id: 'order1' }]);
    });
  });

  describe('findByUser', () => {
    it('should return orders for a user', async () => {
      mockPrisma.order.findMany.mockResolvedValue([{ id: 'order1', attendeeId: 'u1' }]);
      const result = await service.findByUser('u1');
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith({ where: { attendeeId: 'u1' }, include: { tickets: true } });
      expect(result).toEqual([{ id: 'order1', attendeeId: 'u1' }]);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order1' });
      const result = await service.findOne('order1');
      expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({ where: { id: 'order1' }, include: { tickets: true } });
      expect(result).toEqual({ id: 'order1' });
    });
  });

  describe('update', () => {
    it('should update order fields', async () => {
      // Mock ticket as AVAILABLE
      mockIssuedTicketService.findOne.mockResolvedValue({ id: 't1', price: 123, status: TicketStatus.AVAILABLE });
      mockPrisma.order.update.mockResolvedValue({ id: 'order1', totalPrice: 123, method: 'card' });
      const result = await service.update('order1', { method: 'card', ticketItems: ['t1'], userId: 'u1' });
      expect(mockPrisma.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { totalPrice: 123, method: 'card' } });
      expect(result.totalPrice).toBe(123);
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      mockPrisma.order.delete.mockResolvedValue({ id: 'order1' });
      const result = await service.delete('order1');
      expect(mockPrisma.order.delete).toHaveBeenCalledWith({ where: { id: 'order1' } });
      expect(result.id).toBe('order1');
    });
  });

  describe('full ticket purchase flow', () => {
    it('should hold, create order, pay, claim, and update all ticket statuses', async () => {
      // Step 1: User initiates order
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      mockIssuedTicketService.findOne.mockImplementation((id) => {
        if (id === 't1') return Promise.resolve({ id: 't1', price: 100, status: TicketStatus.AVAILABLE });
        if (id === 't2') return Promise.resolve({ id: 't2', price: 200, status: TicketStatus.AVAILABLE });
        return Promise.resolve(undefined);
      });
      mockIssuedTicketService.update.mockResolvedValue({});
      mockPaymentService.createPaymentLink.mockResolvedValue('http://pay.link');
      const txCreate = {
        order: { create: jest.fn().mockResolvedValue({ id: 'order1', ticketItems: ['t1', 't2'], status: OrderStatus.PENDING, attendeeId: 'u1' }), update: jest.fn() },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
      };
      mockPrisma.$transaction.mockImplementationOnce(async (cb) => cb(txCreate));
      // Step 2: Order is created and payment link returned
      const createDto = { userId: 'u1', ticketItems: ['t1', 't2'], method: 'card' };
      const createResult = await service.create(createDto);
      expect(createResult.order).toEqual({ id: 'order1', ticketItems: ['t1', 't2'], status: OrderStatus.PENDING, attendeeId: 'u1' });
      expect(createResult.paymentLink).toBe('http://pay.link');
      // Step 3: User pays, payment is confirmed
      mockPrisma.order.findUnique
        .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PENDING, attendeeId: 'u1', ticketItems: ['t1', 't2'] })
        .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PAID });
      const txConfirm = {
        claimedTicket: { createMany: jest.fn().mockResolvedValue({ count: 2 }) },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
        order: { update: jest.fn().mockResolvedValue({ id: 'order1', status: OrderStatus.PAID }) },
      };
      mockPrisma.$transaction.mockImplementationOnce(async (cb) => cb(txConfirm));
      mockHoldService.releaseTickets.mockResolvedValue(undefined);
      const confirmResult = await service.confirmPayment('order1');
      expect(mockClaimedTicketService.createClaimedTickets).toHaveBeenCalledWith('order1', 'u1', ['t1', 't2'], ClaimedTicketStatus.READY, txConfirm);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t1', { status: TicketStatus.CLAIMED }, txConfirm);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t2', { status: TicketStatus.CLAIMED }, txConfirm);
      expect(txConfirm.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.PAID } });
      expect(mockHoldService.releaseTickets).toHaveBeenCalledWith(['t1', 't2']);
      expect(confirmResult).toEqual({ id: 'order1', status: OrderStatus.PAID });
    });
  });

  describe('edge cases for order flow', () => {
    it('should not claim tickets twice if payment is confirmed twice', async () => {
      mockPrisma.order.findUnique
        .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PAID, attendeeId: 'u1', ticketItems: ['t1', 't2'] });
      await expect(service.confirmPayment('order1')).rejects.toThrow('Order is not pending');
    });

    it('should throw if confirming payment for non-existent order', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce(null);
      await expect(service.confirmPayment('order404')).rejects.toThrow('Order not found');
    });

    it('should throw if confirming payment for cancelled order', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce({ id: 'order1', status: OrderStatus.CANCELLED });
      await expect(service.confirmPayment('order1')).rejects.toThrow('Order is not pending');
    });

    it('should throw if duplicate ticket IDs are provided', async () => {
      mockIssuedTicketService.findOne.mockResolvedValue({ id: 't1', price: 100, status: TicketStatus.AVAILABLE });
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      const tx = {
        order: { create: jest.fn().mockResolvedValue({ id: 'order1' }) },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
      };
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(tx));
      const dto = { userId: 'u1', ticketItems: ['t1', 't1'], method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Duplicate ticket IDs');
    });

    it('should throw if claimed ticket creation fails during payment confirmation', async () => {
      mockPrisma.order.findUnique
        .mockResolvedValueOnce({ id: 'order1', status: OrderStatus.PENDING, attendeeId: 'u1', ticketItems: ['t1'] });
      // Simulate error thrown during transaction
      mockPrisma.$transaction.mockImplementation(async () => {
        throw new (require('@nestjs/common').InternalServerErrorException)('Failed to claim tickets');
      });
      await expect(service.confirmPayment('order1')).rejects.toThrow('Failed to claim tickets');
    });

    it('should throw if ticket is already held by another user', async () => {
      mockIssuedTicketService.findOne.mockResolvedValueOnce({ id: 't1', price: 100, status: TicketStatus.HELD });
      mockHoldService.holdTickets.mockRejectedValue(new Error('Ticket already held'));
      const dto = { userId: 'u1', ticketItems: ['t1'], method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Ticket t1 is not available for sale');
    });
  });
});
