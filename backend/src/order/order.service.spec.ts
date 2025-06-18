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
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });

  describe('create', () => {
    it('should create an order, claim tickets, and update ticket status', async () => {
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
      mockIssuedTicketService.findOne.mockResolvedValue({ id: 't1', price: 100 });

      const dto = { userId: 'u1', ticketItems: ['t1', 't2'], totalPrice: 200, method: 'card' };
      const result = await service.create(dto);
      expect(mockHoldService.holdTickets).toHaveBeenCalledWith(['t1', 't2'], 'u1');
      expect(mockClaimedTicketService.createClaimedTickets).toHaveBeenCalledWith('order1', 'u1', ['t1', 't2'], ClaimedTicketStatus.READY, tx);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t1', { status: TicketStatus.HELD }, tx);
      expect(mockIssuedTicketService.update).toHaveBeenCalledWith('t2', { status: TicketStatus.HELD }, tx);
      expect(result && result.order).toEqual({ id: 'order1' });
      expect(result && result.paymentLink).toBe('http://pay.link');
    });

    it('should throw if no ticket items provided', async () => {
      await expect(service.create({ userId: 'u1', ticketItems: [], totalPrice: 0, method: 'card' })).rejects.toThrow();
    });

    it('should handle transaction error and release tickets', async () => {
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      mockPrisma.$transaction.mockRejectedValue(new Error('fail'));
      mockHoldService.releaseTickets.mockResolvedValue(undefined);
      const dto = { userId: 'u1', ticketItems: ['t1'], totalPrice: 100, method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Failed to create order');
      expect(mockHoldService.releaseTickets).toHaveBeenCalledWith(['t1']);
    });

    it('should handle payment failure and rollback', async () => {
      mockHoldService.holdTickets.mockResolvedValue(undefined);
      const tx = {
        order: { create: jest.fn().mockResolvedValue({ id: 'order1' }), update: jest.fn() },
        claimedTicket: { createMany: jest.fn().mockResolvedValue({ count: 2 }), deleteMany: jest.fn() },
        issuedTicket: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn() },
      };
      mockPrisma.$transaction
        .mockImplementationOnce(async (cb) => cb(tx))
        .mockImplementationOnce(async (cb) => cb(tx));
      mockClaimedTicketService.createClaimedTickets.mockResolvedValue({ count: 2 });
      mockIssuedTicketService.update.mockResolvedValue({});
      mockPaymentService.createPaymentLink.mockRejectedValue(new Error('fail'));
      mockIssuedTicketService.findOne.mockResolvedValue({ id: 't1', price: 100 });
      mockHoldService.releaseTickets.mockResolvedValue(undefined);
      const dto = { userId: 'u1', ticketItems: ['t1'], totalPrice: 100, method: 'card' };
      await expect(service.create(dto)).rejects.toThrow('Failed to initiate payment');
      expect(mockHoldService.releaseTickets).toHaveBeenCalledWith(['t1']);
      expect(tx.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.FAILED } });
      expect(tx.claimedTicket.deleteMany).toHaveBeenCalledWith({ where: { orderId: 'order1' } });
    });
  });

  describe('cancel', () => {
    it('should update order status to CANCELLED', async () => {
      mockPrisma.order.update.mockResolvedValue({ id: 'order1', status: OrderStatus.CANCELLED });
      const result = await service.cancel('order1');
      expect(mockPrisma.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.CANCELLED } });
      expect(result.status).toBe(OrderStatus.CANCELLED);
    });
  });

  describe('confirmPayment', () => {
    it('should update order status to PAID', async () => {
      mockPrisma.order.update.mockResolvedValue({ id: 'order1', status: OrderStatus.PAID });
      const result = await service.confirmPayment('order1');
      expect(mockPrisma.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { status: OrderStatus.PAID } });
      expect(result.status).toBe(OrderStatus.PAID);
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
      mockPrisma.order.update.mockResolvedValue({ id: 'order1', totalPrice: 123, method: 'card' });
      const result = await service.update('order1', { totalPrice: 123, method: 'card' });
      expect(mockPrisma.order.update).toHaveBeenCalledWith({ where: { id: 'order1' }, data: { totalPrice: 123, method: 'card' } });
      expect(result.totalPrice).toBe(123);
      expect(result.method).toBe('card');
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
});
