import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClaimedTicketDto } from './dto/create-claimedticket.dto';
import { ClaimedTicketStatus } from './claimedticket-status.enum';

@Injectable()
export class ClaimedTicketService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClaimedTicketDto) {
    const claimedTicket = await this.prisma.claimedTicket.create({
        data: {
          attendee: { connect: { id: dto.attendeeId } },
          issuedTicket: { connect: { id: dto.ticketId } },
          order: { connect: { id: dto.orderId } },
          status: dto.status || ClaimedTicketStatus.READY,
        }
    }); 
  }

  async findAll() {
    return this.prisma.claimedTicket.findMany({
      include: { issuedTicket: true, attendee: true, order: true },
    });
  }

  async findByUser(attendeeId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { attendeeId },
      include: { issuedTicket: true, order: true },
    });
  }

  async findByOrder(orderId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { orderId },
      include: { issuedTicket: true, attendee: true },
    });
  }

  async findByTicket(ticketId: string) {
    return this.prisma.claimedTicket.findUnique({
      where: { id: ticketId },
      include: { issuedTicket: true, order: true, attendee: true },
    });
  }

  /**
   * Batch create claimed tickets for an order and attendee.
   * Optionally accepts a Prisma transaction/session.
   */
  async createClaimedTickets(
    orderId: string,
    attendeeId: string,
    ticketIds: string[],
    status: ClaimedTicketStatus = ClaimedTicketStatus.READY,
    prismaTx?: PrismaService
  ) {
    const prisma = prismaTx || this.prisma;
    const data = ticketIds.map(id => ({
      id, // id is the same as IssuedTicket.id
      orderId,
      attendeeId,
      status,
    }));
    return prisma.claimedTicket.createMany({ data });
  }

  /**
   * Get all claimed tickets for an attendee.
   */
  async getByAttendee(attendeeId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { attendeeId },
      // To get the related IssuedTicket, query separately using id
    });
  }

  /**
   * Get all claimed tickets for an order.
   */
  async getByOrder(orderId: string) {
    return this.prisma.claimedTicket.findMany({
      where: { orderId },
      // To get the related IssuedTicket, query separately using id
    });
  }

  /**
   * Get claimed ticket by issued ticket id.
   */
  async getByTicket(ticketId: string) {
    return this.prisma.claimedTicket.findUnique({
      where: { id: ticketId },
      // To get the related IssuedTicket, query separately using id
    });
  }

  /**
   * Update the status of a claimed ticket.
   */
  async updateStatus(id: string, status: ClaimedTicketStatus) {
    return this.prisma.claimedTicket.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Remove a claimed ticket by id.
   */
  async remove(id: string) {
    return this.prisma.claimedTicket.delete({
      where: { id },
    });
  }
}
