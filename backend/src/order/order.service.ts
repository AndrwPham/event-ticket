import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OrderStatus } from "./order-status.enum";
import { TicketStatus } from "../issuedticket/ticket-status.enum";
import { PrismaService } from "../prisma/prisma.service";
import { HoldService } from "./hold.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { CreatePaymentDto } from "../payment/dto/create-payment.dto";
import { IssuedTicketService } from "../issuedticket/issuedticket.service";
import { PaymentService } from "../payment/payment.service";
import { v4 as uuidv4 } from "uuid";
import { ClaimedTicketService } from "../claimedticket/claimedticket.service";
import { ClaimedTicketStatus } from "../claimedticket/claimedticket-status.enum";
import { Prisma, PrismaClient } from "@prisma/client";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { OrderCompletedEvent } from "../notification/events/order-completed.event";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
      private readonly prisma: PrismaService,
      private readonly holdService: HoldService,
      private readonly issuedTicketService: IssuedTicketService,
      private readonly paymentService: PaymentService,
      private readonly claimedTicketService: ClaimedTicketService,
      private readonly configService: ConfigService,
      private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateOrderDto) {
    const { userId, ticketItems, method } = dto;

    if (!ticketItems || ticketItems.length === 0) {
      throw new BadRequestException("No ticket items provided");
    }

    // check duplicate ticket IDs
    const uniqueTickets = new Set(ticketItems);
    if (uniqueTickets.size !== ticketItems.length) {
      throw new BadRequestException("Duplicate ticket IDs");
    }

    // Calculate total price from ticket items (fraud prevention)
    const ticketDetails = await Promise.all(
        ticketItems.map((ticketId) =>
            this.issuedTicketService.findOne(ticketId),
        ),
    );
    const totalPrice = ticketDetails.reduce((sum, ticket) => {
      if (!ticket) throw new BadRequestException("Invalid ticket in order");
      if (ticket.status !== TicketStatus.AVAILABLE) {
        throw new ConflictException(
            `Ticket ${ticket.id} is not available for sale`,
        );
      }
      return sum + ticket.price;
    }, 0);
    if (totalPrice <= 0) {
      throw new BadRequestException("Order total must be greater than zero");
    }

    let attendeeId = userId;
    // create AttendeeInfo if userId is not provided (guest checkout)
    if (!userId) {
      if (!dto.guestEmail) {
        throw new BadRequestException(
            "Guest email is required for guest checkout",
        );
      }
      let guestAttendee = await this.prisma.attendeeInfo.findUnique({
        where: { email: dto.guestEmail },
      });
      if (!guestAttendee) {
        guestAttendee = await this.prisma.attendeeInfo.create({
          data: {
            email: dto.guestEmail,
            phone: dto.guestPhone,
            first_name: dto.guestName,
          },
        });
      }
      attendeeId = guestAttendee.id;
    }

    // put on hold, if conflict, return ConflictException
    if (!attendeeId)
      throw new BadRequestException("No attendeeId resolved for order");
    await this.holdService.holdTickets(ticketItems, attendeeId);

    let createdOrder;
    try {
      createdOrder = await this.prisma.$transaction(async (tx: PrismaClient) => {
        const order = await tx.order.create({
          data: {
            totalPrice,
            status: OrderStatus.PENDING,
            method,
            attendee: { connect: { id: attendeeId } },
            ticketItems,
          },
        });
        await Promise.all(
            ticketItems.map((ticketId) =>
                this.issuedTicketService.update(
                    ticketId,
                    { status: TicketStatus.HELD },
                    tx,
                ),
            ),
        );
        return order;
      });
    } catch (error) {
      await this.holdService.releaseTickets(ticketItems);
      if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
      ) {
        throw new ConflictException(
            "One or more tickets are not available or already claimed",
        );
      }
      throw new InternalServerErrorException("Failed to create order");
    }

    // payment
    try {
      const orderId = createdOrder.id;

      // generate unique integer order code
      const numericString = orderId.replace(/\D/g, "");
      const orderCode = Number("1" + numericString.padEnd(15, "0").slice(0, 15));
      let updated = false;
      let attempts = 0;
      let finalOrderCode = orderCode;
      while (!updated && attempts < 5) {
        try {
          await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentRefCode: finalOrderCode },
          });
          updated = true;
        } catch (err) {
          if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
          ) {
        finalOrderCode = Number(
          "1" +
            Math.floor(Math.random() * 1e14)
          .toString()
          .padEnd(15, "0")
          .slice(0, 15)
        );
        attempts++;
          } else {
        throw err;
          }
        }
      }
      if (!updated) {
        throw new InternalServerErrorException(
          "Failed to generate a unique payment reference code"
        );
      }
      
      const paymentItems = ticketDetails
          .filter((ticket) => ticket !== null)
          .map((ticket) => ({
            name: ticket!.id, // Use ticket id as name, or use actual name if available
            price: ticket!.price,
            quantity: 1,
          }));

      // Use frontend base URL from environment variable for flexibility
      const frontendBaseUrl =
          this.configService.get<string>("FRONTEND_BASE_URL") ||
          "https://localhost:5173";
      const paymentReturnPath = "/payment/return";
      const paymentDto: CreatePaymentDto = {
        orderCode,
        description: `REF#${orderCode}`,
        amount: totalPrice,
        items: paymentItems,
        returnUrl: `${frontendBaseUrl}${paymentReturnPath}`,
        cancelUrl: `${frontendBaseUrl}${paymentReturnPath}`,
      };
      const paymentLink = await this.paymentService.createPaymentLink(paymentDto);
      return {
        order: createdOrder,
        paymentLink,
      };
    } catch (error) {
      this.logger.error(
          `Failed to initiate payment for order ID: ${createdOrder.id}. DTO: ${JSON.stringify(dto)}`,
          error instanceof Error ? error.stack : JSON.stringify(error),
      );
      await this.holdService.releaseTickets(ticketItems);
      if (createdOrder && createdOrder.id) {
        await this.prisma.$transaction(async (tx: PrismaClient) => {
          await tx.order.update({
            where: { id: createdOrder.id },
            data: { status: OrderStatus.FAILED },
          });
          await Promise.all(
              ticketItems.map((ticketId) =>
                  this.issuedTicketService.update(
                      ticketId,
                      { status: TicketStatus.AVAILABLE },
                      tx,
                  ),
              ),
          );
        });
      }
      throw new InternalServerErrorException(
          "Failed to initiate payment",
          error.message,
      );
    }
  }

  async cancel(id: string) {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }
      if (
          order.status !== OrderStatus.PENDING &&
          order.status !== OrderStatus.FAILED
      ) {
        throw new BadRequestException(
            "Only pending or failed orders can be cancelled",
        );
      }
      if (!order.paymentRefCode) {
        throw new BadRequestException("Order does not have a payment reference code");
      }
      const ticketItems = order.ticketItems;
      await this.prisma.$transaction(async (tx: PrismaClient) => {
        await tx.order.update({
          where: { id },
          data: { 
            status: OrderStatus.CANCELLED,
            paymentRefCode: null,
          },
        });
        if (ticketItems && ticketItems.length > 0) {
          await Promise.all(
              ticketItems.map((ticketId) =>
                  this.issuedTicketService.update(
                      ticketId,
                      { status: TicketStatus.AVAILABLE },
                      tx,
                  ),
              ),
          );
          await this.holdService.releaseTickets(ticketItems);
        }
      });
      await this.paymentService.cancelPaymentLink(order.paymentRefCode.toString(), "Order cancelled");

      return await this.prisma.order.findUnique({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException("Database error during order cancellation");
      }
      throw error;
    }
  }

  /**
   * Get the internal order id from a paymentRefCode (orderCode)
   */
  async getOrderIdFromPaymentCode(orderCode: string): Promise<string> {
    const order = await this.prisma.order.findUnique({ where: { paymentRefCode: Number(orderCode) } });
    if (!order) {
      throw new NotFoundException('Order not found for given orderCode');
    }
    return order.id;
  }

  /**
   * Confirm payment by orderCode (paymentRefCode) instead of internal id.
   * This is intended for use by the controller/webhook, which should look up by orderCode.
   */
  async confirmPaymentByOrderCode(orderCode: string) {
    // Use the new helper to get the order id
    const orderId = await this.getOrderIdFromPaymentCode(orderCode);
    return this.confirmPayment(orderId);
  }

  async confirmPayment(id: string) {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) {
        throw new NotFoundException("Order not found");
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException("Order is not pending");
      }
      const ticketItems = order.ticketItems;
      if (!ticketItems || ticketItems.length === 0) {
        throw new BadRequestException("No ticket items found for this order");
      }
      let transactionError;
      await this.prisma.$transaction(async (tx: PrismaClient) => {
        try {
          await this.claimedTicketService.createClaimedTickets(
              order.id,
              order.attendeeId,
              ticketItems,
              ClaimedTicketStatus.READY,
              tx,
          );
        } catch (err) {
          transactionError = new InternalServerErrorException(
              "Failed to claim tickets",
          );
          throw transactionError;
        }
        await Promise.all(
            ticketItems.map((ticketId) =>
                this.issuedTicketService.update(
                    ticketId,
                    { status: TicketStatus.CLAIMED },
                    tx,
                ),
            ),
        );
        await tx.order.update({
          where: { id },
          data: { 
            status: OrderStatus.PAID,
            paymentRefCode: null, // Clear paymentRefCode after confirmation
           },
        });
        await this.holdService.releaseTickets(ticketItems);
      });
      if (transactionError) throw transactionError;

      // emit event for order completion
      this.eventEmitter.emit(
          "order.completed",
          new OrderCompletedEvent(order.id, order.attendeeId),
      );
      return await this.prisma.order.findUnique({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ConflictException("Database error during payment confirmation");
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
    const { method, ticketItems } = dto;

    if (!ticketItems || ticketItems.length === 0) {
      throw new BadRequestException("No ticket items provided for update");
    }

    // Recalculate totalPrice from ticketItems
    const ticketDetails = await Promise.all(
        ticketItems.map((ticketId) =>
            this.issuedTicketService.findOne(ticketId),
        ),
    );
    const totalPrice = ticketDetails.reduce((sum, ticket) => {
      if (!ticket) throw new BadRequestException("Invalid ticket in order");
      if (ticket.status !== TicketStatus.AVAILABLE) {
        throw new ConflictException(
            `Ticket ${ticket.id} is not available for sale`,
        );
      }
      return sum + ticket.price;
    }, 0);
    if (totalPrice <= 0) {
      throw new BadRequestException("Order total must be greater than zero");
    }

    // Optionally: update claimed tickets, hold logic, etc. here

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
