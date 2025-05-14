import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketItemDto } from './dto/create-ticket-item..dto';

@Injectable()
export class TicketItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketItemDto) {
    const ticket = await this.prisma.ticket.findUnique({
        where: { id: dto.ticketId },
    });

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    if (ticket.quantity <= 0) {
        throw new Error('Ticket is sold out');
    }

    return this.prisma.$transaction([
        this.prisma.ticketItem.create({
        data: {
            ticket: { connect: { id: dto.ticketId } },
            user: { connect: { id: dto.userId } },
            order: { connect: { id: dto.orderId } },
        },
        }),
        this.prisma.ticket.update({
        where: { id: dto.ticketId },
        data: {
            quantity: { decrement: 1 },
        },
        }),
    ]);
  }

  async findAll() {
    return this.prisma.ticketItem.findMany({
      include: { ticket: true, user: true, order: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.ticketItem.findMany({
      where: { userId },
      include: { ticket: true, order: true },
    });
  }

  async findByOrder(orderId: string) {
    return this.prisma.ticketItem.findMany({
      where: { orderId },
      include: { ticket: true, user: true },
    });
  }

  async findByTicket(ticketId: string) {
    return this.prisma.ticketItem.findMany({
      where: { ticketId },
      include: { order: true, user: true },
    });
  }
}
