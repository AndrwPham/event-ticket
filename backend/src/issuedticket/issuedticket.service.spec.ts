import { Test, TestingModule } from '@nestjs/testing';
import { IssuedTicketService } from './issuedticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from './ticket-status.enum';
import { GenerateIssuedTicketsDto } from './dto/generate-issued-tickets.dto';
import { BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateIssuedTicketDto } from './dto/create-issuedticket.dto';
import { UpdateIssuedTicketDto } from './dto/update-issuedticket.dto';

const mockPrismaService = {
  issuedTicket: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
};

describe('IssuedTicketService', () => {
  let service: IssuedTicketService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuedTicketService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    service = module.get<IssuedTicketService>(IssuedTicketService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all issued tickets', async () => {
      prisma.issuedTicket.findMany.mockResolvedValue([{ id: '1' }]);
      await expect(service.findAll()).resolves.toEqual([{ id: '1' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      prisma.issuedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a ticket by id', async () => {
      prisma.issuedTicket.findUnique.mockResolvedValue({ id: 't' });
      await expect(service.findOne('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.issuedTicket.findUnique.mockResolvedValue(null);
      await expect(service.findOne('t')).rejects.toThrow(NotFoundException);
    });
    it('should throw InternalServerErrorException on error', async () => {
      prisma.issuedTicket.findUnique.mockRejectedValue(new Error('fail'));
      await expect(service.findOne('t')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByEventId', () => {
    it('should return tickets for event', async () => {
      prisma.issuedTicket.findMany.mockResolvedValue([{ id: '1', eventId: 'e' }]);
      await expect(service.findByEventId('e')).resolves.toEqual([{ id: '1', eventId: 'e' }]);
    });
    it('should throw InternalServerErrorException on error', async () => {
      prisma.issuedTicket.findMany.mockRejectedValue(new Error('fail'));
      await expect(service.findByEventId('e')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should create an issued ticket', async () => {
      const dto: CreateIssuedTicketDto = { price: 10, class: 'A', seat: '1', eventId: 'e', organizationId: 'o', currencyId: 'c' };
      prisma.issuedTicket.create.mockResolvedValue({ id: 't', ...dto });
      await expect(service.create(dto)).resolves.toEqual({ id: 't', ...dto });
    });
    it('should throw BadRequestException if organizationId is missing', async () => {
      const dto: any = { price: 10, class: 'A', seat: '1', eventId: 'e', currencyId: 'c' };
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException if currencyId is missing', async () => {
      const dto: any = { price: 10, class: 'A', seat: '1', eventId: 'e', organizationId: 'o' };
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
    it('should throw ConflictException on duplicate', async () => {
      const dto: CreateIssuedTicketDto = { price: 10, class: 'A', seat: '1', eventId: 'e', organizationId: 'o', currencyId: 'c' };
      prisma.issuedTicket.create.mockRejectedValue({ code: 'P2002' });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
    it('should throw NotFoundException on related record not found', async () => {
      const dto: CreateIssuedTicketDto = { price: 10, class: 'A', seat: '1', eventId: 'e', organizationId: 'o', currencyId: 'c' };
      prisma.issuedTicket.create.mockRejectedValue({ code: 'P2025' });
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException for other errors', async () => {
      const dto: CreateIssuedTicketDto = { price: 10, class: 'A', seat: '1', eventId: 'e', organizationId: 'o', currencyId: 'c' };
      prisma.issuedTicket.create.mockRejectedValue({ message: 'fail' });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an issued ticket', async () => {
      prisma.issuedTicket.update.mockResolvedValue({ id: 't', price: 20 });
      await expect(service.update('t', { price: 20 })).resolves.toEqual({ id: 't', price: 20 });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.issuedTicket.update.mockRejectedValue({ code: 'P2025' });
      await expect(service.update('t', { price: 20 })).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException for other errors', async () => {
      prisma.issuedTicket.update.mockRejectedValue({ message: 'fail' });
      await expect(service.update('t', { price: 20 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete an issued ticket', async () => {
      prisma.issuedTicket.delete.mockResolvedValue({ id: 't' });
      await expect(service.remove('t')).resolves.toEqual({ id: 't' });
    });
    it('should throw NotFoundException if not found', async () => {
      prisma.issuedTicket.delete.mockRejectedValue({ code: 'P2025' });
      await expect(service.remove('t')).rejects.toThrow(NotFoundException);
    });
    it('should throw BadRequestException for other errors', async () => {
      prisma.issuedTicket.delete.mockRejectedValue({ message: 'fail' });
      await expect(service.remove('t')).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateTicketsFromSchema', () => {
    it('should throw if tickets already exist', async () => {
      prisma.issuedTicket.count.mockResolvedValue(1);
      const dto = {
        eventId: '1',
        organizationId: '1',
        currencyId: '1',
        schema: { eventId: '1', classes: [] },
      } as GenerateIssuedTicketsDto;
      await expect(service.generateTicketsFromSchema(dto)).rejects.toThrow('Tickets have already been generated for this event.');
    });

    it('should create tickets for each seat if seats are provided', async () => {
      prisma.issuedTicket.count.mockResolvedValue(0);
      prisma.issuedTicket.createMany.mockResolvedValue({ count: 2 });
      const dto: GenerateIssuedTicketsDto = {
        eventId: '1',
        organizationId: '1',
        currencyId: '1',
        schema: {
          eventId: '1',
          classes: [
            {
              label: 'VIP',
              price: 100,
              quantity: 0,
              seats: [
                { seatNumber: 'A1', price: 120 },
                { seatNumber: 'A2', price: 130 },
              ],
            },
          ],
        },
      };
      await service.generateTicketsFromSchema(dto);
      expect(prisma.issuedTicket.createMany).toHaveBeenCalledWith({
        data: [
          {
            price: 120,
            class: 'VIP',
            seat: 'A1',
            status: TicketStatus.UNAVAILABLE,
            eventId: '1',
            organizationId: '1',
            currencyId: '1',
          },
          {
            price: 130,
            class: 'VIP',
            seat: 'A2',
            status: TicketStatus.UNAVAILABLE,
            eventId: '1',
            organizationId: '1',
            currencyId: '1',
          },
        ],
      });
    });

    it('should create tickets by quantity if no seats are provided', async () => {
      prisma.issuedTicket.count.mockResolvedValue(0);
      prisma.issuedTicket.createMany.mockResolvedValue({ count: 3 });
      const dto: GenerateIssuedTicketsDto = {
        eventId: '2',
        organizationId: '2',
        currencyId: '2',
        schema: {
          eventId: '2',
          classes: [
            {
              label: 'General',
              price: 50,
              quantity: 3,
              seats: [],
            },
          ],
        },
      };
      await service.generateTicketsFromSchema(dto);
      expect(prisma.issuedTicket.createMany).toHaveBeenCalledWith({
        data: [
          {
            price: 50,
            class: 'General',
            seat: '#0',
            status: TicketStatus.UNAVAILABLE,
            eventId: '2',
            organizationId: '2',
            currencyId: '2',
          },
          {
            price: 50,
            class: 'General',
            seat: '#1',
            status: TicketStatus.UNAVAILABLE,
            eventId: '2',
            organizationId: '2',
            currencyId: '2',
          },
          {
            price: 50,
            class: 'General',
            seat: '#2',
            status: TicketStatus.UNAVAILABLE,
            eventId: '2',
            organizationId: '2',
            currencyId: '2',
          },
        ],
      });
    });
  });

  describe('generateTicketsFromSchema corner cases', () => {
    it('should handle empty schema gracefully', async () => {
      prisma.issuedTicket.count.mockResolvedValue(0);
      prisma.issuedTicket.createMany.mockResolvedValue({ count: 0 });
      const dto: GenerateIssuedTicketsDto = {
        eventId: '3',
        organizationId: '3',
        currencyId: '3',
        schema: { eventId: '3', classes: [] },
      };
      await service.generateTicketsFromSchema(dto);
      expect(prisma.issuedTicket.createMany).toHaveBeenCalledWith({ data: [] });
    });

    it('should throw or handle negative quantity', async () => {
      prisma.issuedTicket.count.mockResolvedValue(0);
      const dto: GenerateIssuedTicketsDto = {
        eventId: '4',
        organizationId: '4',
        currencyId: '4',
        schema: {
          eventId: '4',
          classes: [
            { label: 'Bad', price: 10, quantity: -5, seats: [] },
          ],
        },
      };
      await service.generateTicketsFromSchema(dto);
      // Should not create any tickets for negative quantity
      expect(prisma.issuedTicket.createMany).toHaveBeenCalledWith({ data: [] });
    });

    it('should handle mixed classes (seats and quantity)', async () => {
      prisma.issuedTicket.count.mockResolvedValue(0);
      prisma.issuedTicket.createMany.mockResolvedValue({ count: 3 });
      const dto: GenerateIssuedTicketsDto = {
        eventId: '5',
        organizationId: '5',
        currencyId: '5',
        schema: {
          eventId: '5',
          classes: [
            {
              label: 'VIP',
              price: 100,
              quantity: 0,
              seats: [
                { seatNumber: 'A1', price: 120 },
              ],
            },
            {
              label: 'General',
              price: 50,
              quantity: 2,
              seats: [],
            },
          ],
        },
      };
      await service.generateTicketsFromSchema(dto);
      expect(prisma.issuedTicket.createMany).toHaveBeenCalledWith({
        data: [
          {
            price: 120,
            class: 'VIP',
            seat: 'A1',
            status: TicketStatus.UNAVAILABLE,
            eventId: '5',
            organizationId: '5',
            currencyId: '5',
          },
          {
            price: 50,
            class: 'General',
            seat: '#0',
            status: TicketStatus.UNAVAILABLE,
            eventId: '5',
            organizationId: '5',
            currencyId: '5',
          },
          {
            price: 50,
            class: 'General',
            seat: '#1',
            status: TicketStatus.UNAVAILABLE,
            eventId: '5',
            organizationId: '5',
            currencyId: '5',
          },
        ],
      });
    });
  });

  describe('makeTicketsAvailableForSale', () => {
    it('should update all UNAVAILABLE tickets to AVAILABLE for an event', async () => {
      prisma.issuedTicket.updateMany.mockResolvedValue({ count: 5 });
      await service.makeTicketsAvailableForSale('event123');
      expect(prisma.issuedTicket.updateMany).toHaveBeenCalledWith({
        where: { eventId: 'event123', status: TicketStatus.UNAVAILABLE },
        data: { status: TicketStatus.AVAILABLE },
      });
    });
  });

  describe('makeTicketsAvailableForSale corner case', () => {
    it('should not fail if there are no UNAVAILABLE tickets', async () => {
      prisma.issuedTicket.updateMany.mockResolvedValue({ count: 0 });
      await service.makeTicketsAvailableForSale('event999');
      expect(prisma.issuedTicket.updateMany).toHaveBeenCalledWith({
        where: { eventId: 'event999', status: TicketStatus.UNAVAILABLE },
        data: { status: TicketStatus.AVAILABLE },
      });
    });
  });

  describe('IssuedTicketService.updateTicketsFromSchema', () => {
    let service: IssuedTicketService;
    let prisma: any;
    const eventId = 'event1';
    const organizationId = 'org1';
    const currencyId = 'cur1';

    beforeEach(() => {
      prisma = {
        issuedTicket: {
          findMany: jest.fn(),
          update: jest.fn(),
          create: jest.fn(),
          delete: jest.fn(),
        },
      };
      service = new IssuedTicketService(prisma);
    });

    describe('General Admission (single class, no seats)', () => {
      it('should add tickets when increasing quantity', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue(
          Array.from({ length: 10 }, (_, i) => ({
            id: `t${i}`,
            class: 'GA',
            seat: `#${i}`,
            status: TicketStatus.UNAVAILABLE,
          }))
        );
        prisma.issuedTicket.create.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [{ label: 'GA', quantity: 15, price: 100 }] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.create).toHaveBeenCalledTimes(5);
      });

      it('should delete tickets when decreasing quantity (no tickets sold)', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue(
          Array.from({ length: 10 }, (_, i) => ({
            id: `t${i}`,
            class: 'GA',
            seat: `#${i}`,
            status: TicketStatus.UNAVAILABLE,
          }))
        );
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [{ label: 'GA', quantity: 5, price: 100 }] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(5);
      });

      it('should preserve sold tickets when decreasing quantity', async () => {
        const tickets = [
          ...Array.from({ length: 7 }, (_, i) => ({
            id: `sold${i}`,
            class: 'GA',
            seat: `#${i}`,
            status: TicketStatus.PAID,
          })),
          ...Array.from({ length: 3 }, (_, i) => ({
            id: `unsold${i}`,
            class: 'GA',
            seat: `#${i+7}`,
            status: TicketStatus.UNAVAILABLE,
          })),
        ];
        prisma.issuedTicket.findMany.mockResolvedValue(tickets);
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [{ label: 'GA', quantity: 5, price: 100 }] },
        };
        await service.updateTicketsFromSchema(dto);
        // Only unsold tickets above 5 should be deleted
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(3);
      });

      it('should not change tickets when quantity is unchanged', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue(
          Array.from({ length: 10 }, (_, i) => ({
            id: `t${i}`,
            class: 'GA',
            seat: `#${i}`,
            status: TicketStatus.UNAVAILABLE,
          }))
        );
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [{ label: 'GA', quantity: 10, price: 100 }] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.create).not.toHaveBeenCalled();
        expect(prisma.issuedTicket.delete).not.toHaveBeenCalled();
      });

      it('should update price for all unsold tickets', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue(
          Array.from({ length: 10 }, (_, i) => ({
            id: `t${i}`,
            class: 'GA',
            seat: `#${i}`,
            status: TicketStatus.UNAVAILABLE,
          }))
        );
        prisma.issuedTicket.update.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [{ label: 'GA', quantity: 10, price: 200 }] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.update).toHaveBeenCalledTimes(10);
      });
    });

    describe('Multiple Classes (no seats)', () => {
      it('should add tickets for increased quantity in one class', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          ...Array.from({ length: 10 }, (_, i) => ({ id: `a${i}`, class: 'A', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
          ...Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, class: 'B', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
        ]);
        prisma.issuedTicket.create.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'A', quantity: 15, price: 100 },
            { label: 'B', quantity: 5, price: 100 },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.create).toHaveBeenCalledTimes(5);
      });

      it('should delete tickets for decreased quantity in one class', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          ...Array.from({ length: 10 }, (_, i) => ({ id: `a${i}`, class: 'A', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
          ...Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, class: 'B', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
        ]);
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'A', quantity: 5, price: 100 },
            { label: 'B', quantity: 5, price: 100 },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(5);
      });

      it('should preserve sold tickets when decreasing quantity in one class', async () => {
        const tickets = [
          ...Array.from({ length: 7 }, (_, i) => ({ id: `soldA${i}`, class: 'A', seat: `#${i}`, status: TicketStatus.PAID })),
          ...Array.from({ length: 3 }, (_, i) => ({ id: `unsoldA${i}`, class: 'A', seat: `#${i+7}`, status: TicketStatus.UNAVAILABLE })),
          ...Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, class: 'B', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
        ];
        prisma.issuedTicket.findMany.mockResolvedValue(tickets);
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'A', quantity: 5, price: 100 },
            { label: 'B', quantity: 5, price: 100 },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        // Only unsold tickets above 5 for class A should be deleted
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(3);
      });

      it('should not change tickets when quantities are unchanged', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          ...Array.from({ length: 10 }, (_, i) => ({ id: `a${i}`, class: 'A', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
          ...Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, class: 'B', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
        ]);
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'A', quantity: 10, price: 100 },
            { label: 'B', quantity: 5, price: 100 },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.create).not.toHaveBeenCalled();
        expect(prisma.issuedTicket.delete).not.toHaveBeenCalled();
      });

      it('should update price for all unsold tickets in one class', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          ...Array.from({ length: 10 }, (_, i) => ({ id: `a${i}`, class: 'A', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
          ...Array.from({ length: 5 }, (_, i) => ({ id: `b${i}`, class: 'B', seat: `#${i}`, status: TicketStatus.UNAVAILABLE })),
        ]);
        prisma.issuedTicket.update.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'A', quantity: 10, price: 300 },
            { label: 'B', quantity: 5, price: 100 },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.update).toHaveBeenCalledTimes(15);
      });
    });

    describe('Seat Map (classes with seats)', () => {
      it('should add new seats', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          { id: 'A1', class: 'VIP', seat: 'A1', status: TicketStatus.UNAVAILABLE },
          { id: 'A2', class: 'VIP', seat: 'A2', status: TicketStatus.UNAVAILABLE },
        ]);
        prisma.issuedTicket.create.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'VIP', price: 500, quantity: 0, seats: [
              { seatNumber: 'A1', price: 500 },
              { seatNumber: 'A2', price: 500 },
              { seatNumber: 'A3', price: 500 },
            ] },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.create).toHaveBeenCalledTimes(1);
      });

      it('should delete removed seats (no tickets sold)', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          { id: 'A1', class: 'VIP', seat: 'A1', status: TicketStatus.UNAVAILABLE },
          { id: 'A2', class: 'VIP', seat: 'A2', status: TicketStatus.UNAVAILABLE },
          { id: 'A3', class: 'VIP', seat: 'A3', status: TicketStatus.UNAVAILABLE },
        ]);
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'VIP', price: 500, quantity: 0, seats: [
              { seatNumber: 'A1', price: 500 },
              { seatNumber: 'A2', price: 500 },
            ] },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(1);
      });

      it('should preserve sold tickets when removing seats', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          { id: 'A1', class: 'VIP', seat: 'A1', status: TicketStatus.PAID },
          { id: 'A2', class: 'VIP', seat: 'A2', status: TicketStatus.UNAVAILABLE },
          { id: 'A3', class: 'VIP', seat: 'A3', status: TicketStatus.UNAVAILABLE },
        ]);
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'VIP', price: 500, quantity: 0, seats: [
              { seatNumber: 'A1', price: 500 },
              { seatNumber: 'A2', price: 500 },
            ] },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        // Only A3 (unsold) should be deleted
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(1);
      });

      it('should update price for changed seats', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          { id: 'A1', class: 'VIP', seat: 'A1', status: TicketStatus.UNAVAILABLE },
          { id: 'A2', class: 'VIP', seat: 'A2', status: TicketStatus.UNAVAILABLE },
        ]);
        prisma.issuedTicket.update.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'VIP', price: 500, quantity: 0, seats: [
              { seatNumber: 'A1', price: 600 },
              { seatNumber: 'A2', price: 700 },
            ] },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        expect(prisma.issuedTicket.update).toHaveBeenCalledTimes(2);
      });

      it('should handle seat renaming (delete old, add new)', async () => {
        prisma.issuedTicket.findMany.mockResolvedValue([
          { id: 'A1', class: 'VIP', seat: 'A1', status: TicketStatus.UNAVAILABLE },
          { id: 'A2', class: 'VIP', seat: 'A2', status: TicketStatus.UNAVAILABLE },
        ]);
        prisma.issuedTicket.create.mockResolvedValue({});
        prisma.issuedTicket.delete.mockResolvedValue({});
        const dto = {
          eventId,
          organizationId,
          currencyId,
          schema: { eventId, classes: [
            { label: 'VIP', price: 500, quantity: 0, seats: [
              { seatNumber: 'A01', price: 500 },
              { seatNumber: 'A2', price: 500 },
            ] },
          ] },
        };
        await service.updateTicketsFromSchema(dto);
        // A1 deleted, A01 created
        expect(prisma.issuedTicket.create).toHaveBeenCalledTimes(1);
        expect(prisma.issuedTicket.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
