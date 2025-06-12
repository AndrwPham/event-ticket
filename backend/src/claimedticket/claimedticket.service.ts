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
  }

  async findAll() {
    return this.prisma.claimedTicket.findMany({
      include: { ticket: true, attendee: true, order: true },
    });
  }

  async findByUser(attendeeId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { attendeeId },
      include: { ticket: true, order: true },
    });
  }

  async findByOrder(orderId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { orderId },
      include: { ticket: true, attendee: true },
    });
  }

  async findByTicket(ticketId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { ticketId },
      include: { order: true, attendee: true },
    });
  }
}
