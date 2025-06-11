import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClaimedTicketDto } from './dto/create-claimedticket.dto';

@Injectable()
export class ClaimedTicketService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClaimedTicketDto) {
    const ticket = await this.prisma.claimedTicket.findUnique({
        where: { id: dto.ticketId },
    });

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    if (ticket.quantity <= 0) {
        throw new Error('Ticket is sold out');
    }

    return this.prisma.$transaction([
        //create ticket item 
        this.prisma.ticketItem.create({
          data: {
            user: { connect: { id: dto.userId } },
            ticket: { connect: { id: dto.ticketId } },
            order: { connect: { id: dto.orderId } },
          },
        }),
        //decrement ticket quantity
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
