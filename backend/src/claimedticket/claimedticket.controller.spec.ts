import { Test, TestingModule } from '@nestjs/testing';
import { ClaimedTicketController } from './claimedticket.controller';
import { ClaimedTicketService } from './claimedticket.service';
import { ClaimedTicketStatus } from './claimedticket-status.enum';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

describe('ClaimedTicketController', () => {
  let controller: ClaimedTicketController;
  let service: ClaimedTicketService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUser: jest.fn(),
    findByOrder: jest.fn(),
    findByTicket: jest.fn(),
    createClaimedTickets: jest.fn(),
    getByAttendee: jest.fn(),
    getByOrder: jest.fn(),
    getByTicket: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimedTicketController],
      providers: [
        { provide: ClaimedTicketService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<ClaimedTicketController>(ClaimedTicketController);
    service = module.get<ClaimedTicketService>(ClaimedTicketService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a claimed ticket', async () => {
      const dto = { attendeeId: 'a', ticketId: 't', orderId: 'o', status: ClaimedTicketStatus.READY };
      mockService.create.mockResolvedValue({ id: 't', ...dto });
      await expect(controller.create(dto)).resolves.toEqual({ id: 't', ...dto });
    });
    it('should throw ConflictException if already claimed', async () => {
      mockService.create.mockRejectedValue(new ConflictException());
      await expect(controller.create({ attendeeId: 'a', ticketId: 't', orderId: 'o' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all claimed tickets', async () => {
      mockService.findAll.mockResolvedValue([{ id: '1' }]);
      await expect(controller.findAll()).resolves.toEqual([{ id: '1' }]);
    });
  });

  describe('findByAttendee', () => {
    it('should return claimed tickets for attendee', async () => {
      mockService.getByAttendee.mockResolvedValue([{ id: '1', attendeeId: 'a' }]);
      await expect(controller.findByAttendee('a')).resolves.toEqual([{ id: '1', attendeeId: 'a' }]);
    });
  });

  describe('findByOrder', () => {
    it('should return claimed tickets for order', async () => {
      mockService.getByOrder.mockResolvedValue([{ id: '1', orderId: 'o' }]);
      await expect(controller.findByOrder('o')).resolves.toEqual([{ id: '1', orderId: 'o' }]);
    });
  });

  describe('findOne', () => {
    it('should return a claimed ticket by ticketId', async () => {
      mockService.getByTicket.mockResolvedValue({ id: 't' });
      await expect(controller.findOne('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      mockService.getByTicket.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('t')).rejects.toThrow(NotFoundException);
    });
  });

  describe('batchCreate', () => {
    it('should batch create claimed tickets', async () => {
      mockService.createClaimedTickets.mockResolvedValue({ count: 2 });
      await expect(controller.batchCreate({ orderId: 'o', attendeeId: 'a', ticketIds: ['t1', 't2'] })).resolves.toEqual({ count: 2 });
    });
    it('should throw ConflictException if any already claimed', async () => {
      mockService.createClaimedTickets.mockRejectedValue(new ConflictException());
      await expect(controller.batchCreate({ orderId: 'o', attendeeId: 'a', ticketIds: ['t1', 't2'] })).rejects.toThrow(ConflictException);
    });
  });

  describe('updateStatus', () => {
    it('should update claimed ticket status', async () => {
      mockService.updateStatus.mockResolvedValue({ id: 't', status: ClaimedTicketStatus.USED });
      await expect(controller.updateStatus('t', { status: ClaimedTicketStatus.USED })).resolves.toEqual({ id: 't', status: ClaimedTicketStatus.USED });
    });
    it('should throw NotFoundException if not found', async () => {
      mockService.updateStatus.mockRejectedValue(new NotFoundException());
      await expect(controller.updateStatus('t', { status: ClaimedTicketStatus.USED })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a claimed ticket', async () => {
      mockService.remove.mockResolvedValue({ id: 't' });
      await expect(controller.remove('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('t')).rejects.toThrow(NotFoundException);
    });
  });
});

describe('ClaimedTicketController API-like unit tests', () => {
  let controller: ClaimedTicketController;
  let service: ClaimedTicketService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getByAttendee: jest.fn(),
    getByOrder: jest.fn(),
    getByTicket: jest.fn(),
    createClaimedTickets: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimedTicketController],
      providers: [
        { provide: ClaimedTicketService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<ClaimedTicketController>(ClaimedTicketController);
    service = module.get<ClaimedTicketService>(ClaimedTicketService);
    jest.clearAllMocks();
  });

  it('POST /claimed-tickets should call create', async () => {
    const dto = { attendeeId: 'a', ticketId: 't', orderId: 'o' };
    mockService.create.mockResolvedValue({ id: 't', ...dto });
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 't', ...dto });
  });

  it('GET /claimed-tickets should call findAll', async () => {
    mockService.findAll.mockResolvedValue([{ id: '1' }]);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1' }]);
  });

  it('GET /claimed-tickets/:id should call getByTicket', async () => {
    mockService.getByTicket.mockResolvedValue({ id: 't' });
    const result = await controller.findOne('t');
    expect(service.getByTicket).toHaveBeenCalledWith('t');
    expect(result).toEqual({ id: 't' });
  });

  it('GET /claimed-tickets/attendee/:attendeeId should call getByAttendee', async () => {
    mockService.getByAttendee.mockResolvedValue([{ id: '1', attendeeId: 'a' }]);
    const result = await controller.findByAttendee('a');
    expect(service.getByAttendee).toHaveBeenCalledWith('a');
    expect(result).toEqual([{ id: '1', attendeeId: 'a' }]);
  });

  it('GET /claimed-tickets/order/:orderId should call getByOrder', async () => {
    mockService.getByOrder.mockResolvedValue([{ id: '1', orderId: 'o' }]);
    const result = await controller.findByOrder('o');
    expect(service.getByOrder).toHaveBeenCalledWith('o');
    expect(result).toEqual([{ id: '1', orderId: 'o' }]);
  });

  it('POST /claimed-tickets/batch should call createClaimedTickets', async () => {
    const dto = { orderId: 'o', attendeeId: 'a', ticketIds: ['t1', 't2'] };
    mockService.createClaimedTickets.mockResolvedValue({ count: 2 });
    const result = await controller.batchCreate(dto);
    expect(service.createClaimedTickets).toHaveBeenCalledWith('o', 'a', ['t1', 't2'], expect.anything());
    expect(result).toEqual({ count: 2 });
  });

  it('PATCH /claimed-tickets/:id/status should call updateStatus', async () => {
    mockService.updateStatus.mockResolvedValue({ id: 't', status: ClaimedTicketStatus.USED });
    const result = await controller.updateStatus('t', { status: ClaimedTicketStatus.USED });
    expect(service.updateStatus).toHaveBeenCalledWith('t', ClaimedTicketStatus.USED);
    expect(result).toEqual({ id: 't', status: ClaimedTicketStatus.USED });
  });

  it('DELETE /claimed-tickets/:id should call remove', async () => {
    mockService.remove.mockResolvedValue({ id: 't' });
    const result = await controller.remove('t');
    expect(service.remove).toHaveBeenCalledWith('t');
    expect(result).toEqual({ id: 't' });
  });
});
