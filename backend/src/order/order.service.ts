import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    
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
