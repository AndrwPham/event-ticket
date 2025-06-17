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
        attendee: dto.userId ? { connect: { id: dto.userId } } : undefined,
        event: dto.eventId ? { connect: { id: dto.eventId } } : undefined,
        ticket: dto.ticketId ? { connect: { id: dto.ticketId } } : undefined,
      }
    });
  }

  findAll() {
    return this.prisma.image.findMany({
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.image.findUnique({ 
      where: { id },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findByUserId(attendeeId: string) {
    return this.prisma.image.findMany({ 
      where: { attendeeId },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findByEventId(eventId: string) {
    return this.prisma.image.findMany({ 
      where: { eventId },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findByTicketId(ticketId: string) {
    return this.prisma.image.findMany({ 
      where: { ticketId },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findByUserIdAndType(attendeeId: string, type: string) {
    return this.prisma.image.findMany({ 
      where: { attendeeId, type },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findByEventIdAndType(eventId: string, type: string) {
    return this.prisma.image.findMany({ 
      where: { eventId, type },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  findByTicketIdAndType(ticketId: string, type: string) {
    return this.prisma.image.findMany({ 
      where: { ticketId, type },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });
  }

  update(id: string, dto: CreateImageDto) {
    return this.prisma.image.update({ 
      where: { id }, 
      data: {
        url: dto.url,
        type: dto.type,
        attendee: dto.userId ? { connect: { id: dto.userId } } : { disconnect: true },
        event: dto.eventId ? { connect: { id: dto.eventId } } : { disconnect: true },
        ticket: dto.ticketId ? { connect: { id: dto.ticketId } } : { disconnect: true },
      },
    });
  }

  remove(id: string) {
    return this.prisma.image.delete({ 
      where: { id },
    });
  }
}