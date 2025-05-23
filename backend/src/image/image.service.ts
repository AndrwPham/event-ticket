import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateImageDto) {
    return this.prisma.image.create({ 
      data: {
        url: dto.url,
        type: dto.type,
        user: { connect: { id: dto.userId } },
        event: { connect: { id: dto.eventId } },
        ticket: { connect: { id: dto.ticketId } },
      }
    });
  }

  findAll() {
    return this.prisma.image.findMany();
  }

  findOne(id: string) {
    return this.prisma.image.findUnique({ where: { id } });
  }

  findByUserId(userId: string) {
    return this.prisma.image.findMany({ where: { userId } });
  }

  findByEventId(eventId: string) {
    return this.prisma.image.findMany({ where: { eventId } });
  }

  findByTicketId(ticketId: string) {
    return this.prisma.image.findMany({ where: { ticketId } });
  }

  findByUserIdAndType(
    userId: string, 
    type: string,
  ) {
    return this.prisma.image.findMany({ where: { userId, type } });
  }

  findByEventIdAndType(
    eventId: string, 
    type: string,
  ) {
    return this.prisma.image.findMany({ where: { eventId, type } });
  }

    findByTicketIdAndType(
        ticketId: string, 
        type: string,
    ) {
        return this.prisma.image.findMany({ where: { ticketId, type } });
    }

  update(id: string, dto: CreateImageDto) {
    return this.prisma.image.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.image.delete({ where: { id } });
  }
}
