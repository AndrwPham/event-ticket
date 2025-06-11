import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIssuedTicketDto } from './dto/create-issuedticket.dto';

@Injectable()
export class IssuedTicketService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.issuedTicket.findMany({
      include: { event: true, images: true },
    });
  }

  findOne(id: string) {
    return this.prisma.issuedTicket.findUnique({
      where: { id },
      include: { event: true, images: true },
    });
  }

    findByEventId(eventId: string) {
        return this.prisma.issuedTicket.findMany({
        where: { eventId },
        include: { event: true, images: true },
        });
    }


  update(id: string, dto: CreateIssuedTicketDto) {
    return this.prisma.issuedTicket.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.issuedTicket.delete({ where: { id } });
  }
}
