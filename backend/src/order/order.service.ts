import { Injectable, ConflictException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from './order-status.enum';
import { TicketStatus } from '../issuedticket/ticket-status.enum';
import { ClaimedTicketStatus } from '../claimedticket/claimedticket-status.enum';
import { PrismaService } from '../prisma/prisma.service';
import { HoldService } from './hold.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { ClaimedTicketService } from '../claimedticket/claimedticket.service';
import { Prisma } from '@prisma/client';
import { PaymentService } from '../payment/payment.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly holdService: HoldService,
    private readonly issuedTicketService: IssuedTicketService,
    private readonly claimedTicketService: ClaimedTicketService,
    private readonly paymentService: PaymentService,
  ) { }

  async create(dto: CreateOrderDto) {
    const { userId, ticketItems, totalPrice, method } = dto;

    if (!ticketItems || ticketItems.length === 0) {
      throw new BadRequestException('No ticket items provided');
    }

    // put on hold, if conflict, return ConflictException
    await this.holdService.holdTickets(ticketItems, userId);

    let createdOrder;
    try {
      createdOrder = await this.prisma.$transaction(async (tx: import('@prisma/client').PrismaClient) => {
        const order = await tx.order.create({
          data: {
            totalPrice,
            status: OrderStatus.PENDING,
            method,
            attendee: { connect: { id: userId } },
          },
        });
        await this.claimedTicketService.createClaimedTickets(
          order.id,
          userId,
          ticketItems,
          ClaimedTicketStatus.READY,
          tx
        );
        await Promise.all(ticketItems.map(ticketId =>
          this.issuedTicketService.update(ticketId, { status: TicketStatus.HELD }, tx)
        ));
        return order;
      });

    } catch (error) {
      await this.holdService.releaseTickets(ticketItems);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('One or more tickets are not available or already claimed');
      }

      throw new InternalServerErrorException('Failed to create order');
    }

    // payment
    try {
      const ticketDetails = await Promise.all(
        ticketItems.map((ticketId) => this.issuedTicketService.findOne(ticketId))
      );
      const paymentItems = ticketDetails
        .filter((ticket) => ticket !== null)
        .map((ticket) => ({
          id: ticket!.id,
          price: ticket!.price,
          quantity: 1,
        }));

      const orderCode = uuidv4();

      const paymentDto: CreatePaymentDto = {
        orderCode,
        description: `${orderCode}`,
        amount: totalPrice,
        items: paymentItems,
        returnUrl: `https://localhost:5173/payment/success?orderCode=${orderCode}`,
        cancelUrl: `https://localhost:5173/payment/cancel?orderCode=${orderCode}`,
      };

      const paymentLink = await this.paymentService.createPaymentLink(paymentDto);

      return {
        order: createdOrder,
        paymentLink,
      };
    } catch (error) {
      await this.holdService.releaseTickets(ticketItems);
      await this.prisma.$transaction(async (tx: import('@prisma/client').PrismaClient) => {
        await tx.order.update({
          where: { id: createdOrder.id },
          data: { status: OrderStatus.FAILED },
        });
        // delete claimed tickets
        await tx.claimedTicket.deleteMany({ where: { orderId: createdOrder.id } });
        // reset issued ticket status
        await Promise.all(ticketItems.map(ticketId =>
          this.issuedTicketService.update(ticketId, { status: TicketStatus.AVAILABLE }, tx)
        ));
        throw new InternalServerErrorException('Failed to initiate payment', error.message);
      });
    }
  }

  async cancel(id: string) {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.FAILED) {
        throw new BadRequestException('Only pending or failed orders can be cancelled');
      }
      return await this.prisma.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException('Database error during order cancellation');
      }
      throw error;
    }
  }

  async confirmPayment(id: string) {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be confirmed as paid');
      }
      return await this.prisma.order.update({
        where: { id },
        data: { status: OrderStatus.PAID },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException('Database error during payment confirmation');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { tickets: true } });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { attendeeId: userId },
      include: { tickets: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { tickets: true },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const { totalPrice, method } = dto;

    return this.prisma.order.update({
      where: { id },
      data: {
        totalPrice,
        method,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
