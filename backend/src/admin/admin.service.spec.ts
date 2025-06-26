import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { EventStatus } from '../event/types/event-status.enum';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('AdminService.validateEvent', () => {
    let service: AdminService;
    let prisma: any;
    let ticketService: any;

    beforeEach(async () => {
        prisma = {
            event: {
                findUnique: jest.fn(),
                update: jest.fn(),
            },
            currency: {
                findFirst: jest.fn(),
            },
        };
        ticketService = {
            generateTicketsFromSchema: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                { provide: PrismaService, useValue: prisma },
                { provide: IssuedTicketService, useValue: ticketService },
            ],
        }).compile();

        service = module.get(AdminService);
    });

    it('propagates HttpException from ticket generation', async () => {
        const event = { id: 'e1', organizationId: 'org1', ticketSchema: { classes: [] } };
        prisma.event.findUnique.mockResolvedValue(event);
        prisma.event.update.mockResolvedValue({ ...event, status: EventStatus.APPROVED });
        prisma.currency.findFirst.mockResolvedValue({ id: 'cur1' });
        ticketService.generateTicketsFromSchema.mockRejectedValue(new BadRequestException('Tickets exist'));

        await expect(service.validateEvent('e1', EventStatus.APPROVED)).rejects.toThrow(BadRequestException);
    });

    it('wraps non-HttpException into InternalServerErrorException', async () => {
        const event = { id: 'e2', organizationId: 'org2', ticketSchema: { classes: [] } };
        prisma.event.findUnique.mockResolvedValue(event);
        prisma.event.update.mockResolvedValue({ ...event, status: EventStatus.APPROVED });
        prisma.currency.findFirst.mockResolvedValue({ id: 'cur2' });
        ticketService.generateTicketsFromSchema.mockRejectedValue(new Error('unexpected'));

        await expect(service.validateEvent('e2', EventStatus.APPROVED)).rejects.toThrow(InternalServerErrorException);
    });

    it('throws NotFoundException if event not found', async () => {
        prisma.event.findUnique.mockResolvedValue(null);

        await expect(service.validateEvent('missing', EventStatus.APPROVED)).rejects.toThrow(NotFoundException);
    });
});