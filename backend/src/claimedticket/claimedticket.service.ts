import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClaimedTicketDto } from './dto/create-claimedticket.dto';
import { ClaimedTicketStatus } from './claimedticket-status.enum';

@Injectable()
export class ClaimedTicketService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClaimedTicketDto) {
    try {
      return await this.prisma.claimedTicket.create({
        data: {
          attendee: { connect: { id: dto.attendeeId } },
          issuedTicket: { connect: { id: dto.ticketId } },
          order: { connect: { id: dto.orderId } },
          status: dto.status || ClaimedTicketStatus.READY,
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('This ticket has already been claimed.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Related record not found.');
      }
      throw new BadRequestException(error.message || 'Failed to create claimed ticket.');
    }
  }

  async findAll() {
    try {
      return await this.prisma.claimedTicket.findMany({
        include: { issuedTicket: true, attendee: true, order: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch claimed tickets.');
    }
  }

  async findByUser(attendeeId: string) {
    try {
      return await this.prisma.claimedTicket.findMany({
        where: { attendeeId },
        include: { issuedTicket: true, order: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch claimed tickets for attendee.');
    }
  }

  async findByOrder(orderId: string) {
    try {
      return await this.prisma.claimedTicket.findMany({
        where: { orderId },
        include: { issuedTicket: true, attendee: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch claimed tickets for order.');
    }
  }

  async findByTicket(ticketId: string) {
    try {
      const ticket = await this.prisma.claimedTicket.findUnique({
        where: { id: ticketId },
        include: { issuedTicket: true, order: true, attendee: true },
      });
      if (!ticket) throw new NotFoundException('Claimed ticket not found.');
      return ticket;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch claimed ticket.');
    }
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
    try {
      return await prisma.claimedTicket.createMany({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('One or more tickets have already been claimed.');
      }
      throw new BadRequestException(error.message || 'Failed to batch claim tickets.');
    }
  }

  /**
   * Get all claimed tickets for an attendee.
   */
  async getByAttendee(attendeeId: string) {
    try {
      return await this.prisma.claimedTicket.findMany({
        where: { attendeeId },
        // To get the related IssuedTicket, query separately using id
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch claimed tickets for attendee.');
    }
  }

  /**
   * Get all claimed tickets for an order.
   */
  async getByOrder(orderId: string) {
    try {
      return await this.prisma.claimedTicket.findMany({
        where: { orderId },
        // To get the related IssuedTicket, query separately using id
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch claimed tickets for order.');
    }
  }

  /**
   * Get claimed ticket by issued ticket id.
   */
  async getByTicket(ticketId: string) {
    try {
      const ticket = await this.prisma.claimedTicket.findUnique({
        where: { id: ticketId },
        // To get the related IssuedTicket, query separately using id
      });
      if (!ticket) throw new NotFoundException('Claimed ticket not found.');
      return ticket;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch claimed ticket.');
    }
  }

  /**
   * Update the status of a claimed ticket.
   */
  async updateStatus(id: string, status: ClaimedTicketStatus) {
    try {
      const updated = await this.prisma.claimedTicket.update({
        where: { id },
        data: { status },
      });
      return updated;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Claimed ticket not found.');
      }
      throw new BadRequestException(error.message || 'Failed to update claimed ticket status.');
    }
  }

  /**
   * Remove a claimed ticket by id.
   */
  async remove(id: string) {
    try {
      return await this.prisma.claimedTicket.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Claimed ticket not found.');
      }
      throw new BadRequestException(error.message || 'Failed to delete claimed ticket.');
    }
  }
}
