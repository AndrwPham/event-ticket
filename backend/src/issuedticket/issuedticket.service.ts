import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-issuedticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
        class: dto.class,
        status: dto.status,
        event: { connect: { id: dto.eventId } },
      },
    });
  }

  findAll() {
    return this.prisma.ticket.findMany({
      include: { event: true, images: true },
    });
  }

  findOne(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { event: true, images: true },
    });
  }

    findByEventId(eventId: string) {
        return this.prisma.ticket.findMany({
        where: { eventId },
        include: { event: true, images: true },
        });
    }


  update(id: string, dto: CreateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.ticket.delete({ where: { id } });
  }
}
