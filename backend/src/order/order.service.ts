import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HoldService } from './hold.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { ClaimedTicketService } from '../claimedticket/claimedticket.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly holdService: HoldService,
    private readonly issuedTicketService: IssuedTicketService,
    private readonly claimedTicketService: ClaimedTicketService
  ) { }

  async create(dto: CreateOrderDto) {
    const { userId, ticketItems, totalPrice, method } = dto;

    if (!ticketItems || ticketItems.length === 0) {
      throw new BadRequestException('No ticket items provided');
    }

    // put on hold, if conflict, return ConflictException
    await this.holdService.holdTickets(ticketItems, userId);

    try {
      const order = await this.prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            totalPrice,
            status: 'PENDING',
            method,
            attendee: { connect: { id: userId } },
          },
        });

        const claimPromises = ticketItems.map(async (ticketId) => {
          tx.claimedTicket.create({
            data: {
              attendee: { connect: { id: userId } },
              ticket: { connect: { id: ticketId } },
              order: { connect: { id: createdOrder.id } },
            },
          });
        });

        await Promise.all(claimPromises);

        return createdOrder;
      });

    } catch (error) {
      await this.holdService.releaseTickets(ticketItems);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('One or more tickets are not available or already claimed');
      }

      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async findAll() {
    return this.prisma.order.findMany({
    });
  }

  async findByUser(attendeeId: string) {
    return this.prisma.order.findMany({
      where: { attendeeId },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        method: dto.method,
      },
    });
  }

  async cancel(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async confirmPayment(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: 'PAID' },
    });
  }
}
