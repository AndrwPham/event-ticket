import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // Lookup ticketItems and calculate total price
    const ticketItems = await this.prisma.ticketItem.findMany({
      where: { id: { in: dto.ticketItems } },
      include: { ticket: true },
    });

    if (ticketItems.length === 0) {
      throw new NotFoundException('No ticket items found');
    }

    const totalPrice = ticketItems.reduce((sum, item) => {
      return sum + item.ticket.price;
    }, 0);

    return this.prisma.order.create({
      data: {
        user: { connect: { id: dto.userId } },
        ticketItems: {
          connect: dto.ticketItems.map((id) => ({ id })),
        },
        totalPrice,
        status: 'PENDING',
        method: dto.method,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { ticketItems: true, user: true },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { ticketItems: true },
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
