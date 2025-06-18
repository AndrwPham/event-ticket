import { Test, TestingModule } from '@nestjs/testing';
import { IssuedTicketService } from './issuedticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from './ticket-status.enum';
import { GenerateIssuedTicketsDto } from './dto/generate-issued-tickets.dto';

const mockPrismaService = {
  issuedTicket: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
            seat: '',
            status: TicketStatus.UNAVAILABLE,
            eventId: '2',
            organizationId: '2',
            currencyId: '2',
          },
          {
            price: 50,
            class: 'General',
            seat: '',
            status: TicketStatus.UNAVAILABLE,
            eventId: '2',
            organizationId: '2',
            currencyId: '2',
          },
          {
            price: 50,
            class: 'General',
            seat: '',
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
            seat: '',
            status: TicketStatus.UNAVAILABLE,
            eventId: '5',
            organizationId: '5',
            currencyId: '5',
          },
          {
            price: 50,
            class: 'General',
            seat: '',
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
});
