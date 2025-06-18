import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIssuedTicketDto } from './dto/create-issuedticket.dto';
import { UpdateIssuedTicketDto } from './dto/update-issuedticket.dto';
import { TicketStatus } from './ticket-status.enum';
import { GenerateIssuedTicketsDto } from './dto/generate-issued-tickets.dto';

@Injectable()
export class IssuedTicketService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.issuedTicket.findMany({
      include: { event: true, images: true },
    });
  }

  findOne(id: string) {
    return this.prisma.issuedTicket.findUnique({
      where: { id },
      include: { event: true, images: true },
    });
  }

  findByEventId(eventId: string) {
    return this.prisma.issuedTicket.findMany({
      where: { eventId },
      include: { event: true, images: true },
    });
  }

  async create(dto: CreateIssuedTicketDto) {
    if (!dto.organizationId) {
      throw new Error('organizationId is required');
    }
    if (!dto.currencyId) {
      throw new Error('currencyId is required');
    }
    return this.prisma.issuedTicket.create({
      data: {
        price: dto.price,
        class: dto.class,
        seat: dto.seat,
        status: dto.status || TicketStatus.UNAVAILABLE,
        eventId: dto.eventId,
        organizationId: dto.organizationId,
        currencyId: dto.currencyId,
      },
    });
  }

  update(id: string, dto: UpdateIssuedTicketDto) {
    const allowedFields = ['price', 'class', 'seat', 'status'];
    const data: any = {};
    for (const field of allowedFields) {
      if (dto[field] !== undefined) {
        data[field] = dto[field];
      }
    }
    return this.prisma.issuedTicket.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.issuedTicket.delete({ where: { id } });
  }

  async generateTicketsFromSchema(dto: GenerateIssuedTicketsDto) {
    const { eventId, organizationId, currencyId, schema } = dto;
    // Check if tickets already exist for this event
    const existingCount = await this.prisma.issuedTicket.count({ where: { eventId } });
    if (existingCount > 0) {
      throw new BadRequestException('Tickets have already been generated for this event.');
    }
    const ticketsToCreate: Array<{
      price: number;
      class: string;
      seat: string;
      status: TicketStatus;
      eventId: string;
      organizationId: string;
      currencyId: string;
    }> = [];
    for (const ticketClass of schema.classes) {
      if (ticketClass.seats && ticketClass.seats.length > 0) {
        for (const seat of ticketClass.seats) {
          ticketsToCreate.push({
            price: seat.price,
            class: ticketClass.label,
            seat: seat.seatNumber,
            status: TicketStatus.UNAVAILABLE,
            eventId,
            organizationId,
            currencyId,
          });
        }
      } else {
        for (let i = 0; i < ticketClass.quantity; i++) {
          ticketsToCreate.push({
            price: ticketClass.price,
            class: ticketClass.label,
            seat: '',
            status: TicketStatus.UNAVAILABLE,
            eventId,
            organizationId,
            currencyId,
          });
        }
      }
    }
    return this.prisma.issuedTicket.createMany({ data: ticketsToCreate });
  }

  async makeTicketsAvailableForSale(eventId: string) {
    return this.prisma.issuedTicket.updateMany({
      where: {
        eventId,
        status: TicketStatus.UNAVAILABLE,
      },
      data: {
        status: TicketStatus.AVAILABLE,
      },
    });
  }
}
