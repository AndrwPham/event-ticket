import { Injectable, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CreateIssuedTicketDto } from './dto/create-issuedticket.dto';
import { UpdateIssuedTicketDto } from './dto/update-issuedticket.dto';
import { TicketStatus } from './ticket-status.enum';
import { GenerateIssuedTicketsDto } from './dto/generate-issued-tickets.dto';

@Injectable()
export class IssuedTicketService {
  constructor(private prisma: PrismaService) { }

    //TODO: fix all image relations
  async findAll() {
    try {
      return await this.prisma.issuedTicket.findMany({
        // include: { event: true, images: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch issued tickets.');
    }
  }

  async findOne(id: string) {
    try {
      const ticket = await this.prisma.issuedTicket.findUnique({
        where: { id },
        // include: { event: true, images: true },
      });
      if (!ticket) throw new NotFoundException('Issued ticket not found.');
      return ticket;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch issued ticket.');
    }
  }

  async findByEventId(eventId: string) {
    try {
      return await this.prisma.issuedTicket.findMany({
        where: { eventId },
        // include: { event: true, images: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch issued tickets for event.');
    }
  }

  async create(dto: CreateIssuedTicketDto) {
    if (!dto.organizationId) {
      throw new BadRequestException('organizationId is required');
    }
    if (!dto.currencyId) {
      throw new BadRequestException('currencyId is required');
    }
    try {
      return await this.prisma.issuedTicket.create({
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Duplicate issued ticket.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Related record not found.');
      }
      throw new BadRequestException(error.message || 'Failed to create issued ticket.');
    }
  }

  async update(id: string, dto: UpdateIssuedTicketDto, prismaClient?: PrismaClient) {
    const prisma: PrismaClient = (prismaClient as PrismaClient) || this.prisma;
    const allowedFields = ['price', 'class', 'seat', 'status'];
    const data: any = {};
    for (const field of allowedFields) {
      if (dto[field] !== undefined) {
        data[field] = dto[field];
      }
    }
    try {
      const updated = await prisma.issuedTicket.update({
        where: { id },
        data,
      });
      return updated;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Issued ticket not found.');
      }
      throw new BadRequestException(error.message || 'Failed to update issued ticket.');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.issuedTicket.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Issued ticket not found.');
      }
      throw new BadRequestException(error.message || 'Failed to delete issued ticket.');
    }
  }

  async generateTicketsFromSchema(dto: GenerateIssuedTicketsDto) {
    const { eventId, organizationId, currencyId, schema } = dto;
    try {
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
              price: seat?.price ?? ticketClass.price, // TODO: dirty fix
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
      return await this.prisma.issuedTicket.createMany({ data: ticketsToCreate });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error.message || 'Failed to generate tickets from schema.');
    }
  }

  async makeTicketsAvailableForSale(eventId: string) {
    try {
      return await this.prisma.issuedTicket.updateMany({
        where: {
          eventId,
          status: TicketStatus.UNAVAILABLE,
        },
        data: {
          status: TicketStatus.AVAILABLE,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update ticket status to AVAILABLE.');
    }
  }
}
