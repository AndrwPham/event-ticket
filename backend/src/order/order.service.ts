import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
      createdOrder = await this.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
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
              order: { connect: { id: order.id } },
            },
          });
        });

        await Promise.all(claimPromises);

        await tx.issuedTicket.updateMany({
          where: { id: { in: ticketItems } },
          data: { status: 'RESERVED' },
        });

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
      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: createdOrder.id },
          data: { status: 'FAILED' },
        });

        // delete claimed tickets
        await tx.claimedTicket.deleteMany({ where: { orderId: createdOrder.id } });

        // reset issued ticket status
        await tx.issuedTicket.updateMany({
          where: { id: { in: ticketItems } },
          data: { status: 'AVAILABLE' },
        });
        throw new InternalServerErrorException('Failed to initiate payment', error.message);
      });
    }
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
