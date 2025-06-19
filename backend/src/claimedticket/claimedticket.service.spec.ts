import { Test, TestingModule } from '@nestjs/testing';
import { ClaimedTicketService } from './claimedticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClaimedTicketStatus } from './claimedticket-status.enum';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrisma = {
  claimedTicket: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ClaimedTicketService', () => {
  let service: ClaimedTicketService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimedTicketService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<ClaimedTicketService>(ClaimedTicketService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a claimed ticket', async () => {
      const dto = { attendeeId: 'a', ticketId: 't', orderId: 'o', status: ClaimedTicketStatus.READY };
      mockPrisma.claimedTicket.create.mockResolvedValue({ id: 't', ...dto });
      await expect(service.create(dto)).resolves.toEqual({ id: 't', ...dto });
    });
    it('should throw ConflictException if already claimed', async () => {
      mockPrisma.claimedTicket.create.mockRejectedValue({ code: 'P2002' });
      await expect(service.create({ attendeeId: 'a', ticketId: 't', orderId: 'o' })).rejects.toThrow(ConflictException);
    });
    it('should throw NotFoundException if related record not found', async () => {
      mockPrisma.claimedTicket.create.mockRejectedValue({ code: 'P2025' });
      await expect(service.create({ attendeeId: 'a', ticketId: 't', orderId: 'o' })).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException for other errors', async () => {
      mockPrisma.claimedTicket.create.mockRejectedValue({ message: 'fail' });
      await expect(service.create({ attendeeId: 'a', ticketId: 't', orderId: 'o' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all claimed tickets', async () => {
      mockPrisma.claimedTicket.findMany.mockResolvedValue([{ id: '1' }]);
      await expect(service.findAll()).resolves.toEqual([{ id: '1' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow('Failed to fetch claimed tickets.');
    });
  });

  describe('findByUser', () => {
    it('should return claimed tickets for attendee', async () => {
      mockPrisma.claimedTicket.findMany.mockResolvedValue([{ id: '1', attendeeId: 'a' }]);
      await expect(service.findByUser('a')).resolves.toEqual([{ id: '1', attendeeId: 'a' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.findByUser('a')).rejects.toThrow('Failed to fetch claimed tickets for attendee.');
    });
  });

  describe('findByOrder', () => {
    it('should return claimed tickets for order', async () => {
      mockPrisma.claimedTicket.findMany.mockResolvedValue([{ id: '1', orderId: 'o' }]);
      await expect(service.findByOrder('o')).resolves.toEqual([{ id: '1', orderId: 'o' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.findByOrder('o')).rejects.toThrow('Failed to fetch claimed tickets for order.');
    });
  });

  describe('findByTicket', () => {
    it('should return a claimed ticket by ticketId', async () => {
      mockPrisma.claimedTicket.findUnique.mockResolvedValue({ id: 't' });
      await expect(service.findByTicket('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.claimedTicket.findUnique.mockResolvedValue(null);
      await expect(service.findByTicket('t')).rejects.toThrow(NotFoundException);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findUnique.mockRejectedValue(new Error('fail'));
      await expect(service.findByTicket('t')).rejects.toThrow('Failed to fetch claimed ticket.');
    });
  });

  describe('createClaimedTickets', () => {
    it('should batch create claimed tickets', async () => {
      mockPrisma.claimedTicket.createMany.mockResolvedValue({ count: 2 });
      await expect(service.createClaimedTickets('o', 'a', ['t1', 't2'])).resolves.toEqual({ count: 2 });
    });
    it('should throw ConflictException if any already claimed', async () => {
      mockPrisma.claimedTicket.createMany.mockRejectedValue({ code: 'P2002' });
      await expect(service.createClaimedTickets('o', 'a', ['t1', 't2'])).rejects.toThrow(ConflictException);
    });
    it('should throw BadRequestException for other errors', async () => {
      mockPrisma.claimedTicket.createMany.mockRejectedValue({ message: 'fail' });
      await expect(service.createClaimedTickets('o', 'a', ['t1', 't2'])).rejects.toThrow(BadRequestException);
    });
  });

  describe('getByAttendee', () => {
    it('should return claimed tickets for attendee', async () => {
      mockPrisma.claimedTicket.findMany.mockResolvedValue([{ id: '1', attendeeId: 'a' }]);
      await expect(service.getByAttendee('a')).resolves.toEqual([{ id: '1', attendeeId: 'a' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.getByAttendee('a')).rejects.toThrow('Failed to fetch claimed tickets for attendee.');
    });
  });

  describe('getByOrder', () => {
    it('should return claimed tickets for order', async () => {
      mockPrisma.claimedTicket.findMany.mockResolvedValue([{ id: '1', orderId: 'o' }]);
      await expect(service.getByOrder('o')).resolves.toEqual([{ id: '1', orderId: 'o' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.getByOrder('o')).rejects.toThrow('Failed to fetch claimed tickets for order.');
    });
  });

  describe('getByTicket', () => {
    it('should return a claimed ticket by ticketId', async () => {
      mockPrisma.claimedTicket.findUnique.mockResolvedValue({ id: 't' });
      await expect(service.getByTicket('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.claimedTicket.findUnique.mockResolvedValue(null);
      await expect(service.getByTicket('t')).rejects.toThrow(NotFoundException);
    });
    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.claimedTicket.findUnique.mockRejectedValue(new Error('fail'));
      await expect(service.getByTicket('t')).rejects.toThrow('Failed to fetch claimed ticket.');
    });
  });

  describe('updateStatus', () => {
    it('should update claimed ticket status', async () => {
      mockPrisma.claimedTicket.update.mockResolvedValue({ id: 't', status: ClaimedTicketStatus.USED });
      await expect(service.updateStatus('t', ClaimedTicketStatus.USED)).resolves.toEqual({ id: 't', status: ClaimedTicketStatus.USED });
    });
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.claimedTicket.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.updateStatus('t', ClaimedTicketStatus.USED)).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException for other errors', async () => {
      mockPrisma.claimedTicket.update.mockRejectedValue({ message: 'fail' });
      await expect(service.updateStatus('t', ClaimedTicketStatus.USED)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a claimed ticket', async () => {
      mockPrisma.claimedTicket.delete.mockResolvedValue({ id: 't' });
      await expect(service.remove('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      mockPrisma.claimedTicket.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('t')).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException for other errors', async () => {
      mockPrisma.claimedTicket.delete.mockRejectedValue({ message: 'fail' });
      await expect(service.remove('t')).rejects.toThrow(BadRequestException);
    });
  });
});
