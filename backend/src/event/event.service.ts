import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {

    const event = await this.prisma.event.create({
      data: dto,
    });

    return event;
  }

  findAll() {
    return this.prisma.event.findMany({
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
    });
  }

  async findByTag(tagId: string) {
    return this.prisma.event.findMany({
      where: { tagIds: { has: tagId } },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
    });
  }

  findByCity(city: string) {
    return this.prisma.event.findMany({
      where: { city },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
    });
  }

  findByDistrict(district: string) {
    return this.prisma.event.findMany({
      where: { district },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
    });
  }

  findByWard(ward: string) {
    return this.prisma.event.findMany({
      where: { ward },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
    });
  }

  async update(id: string, dto: CreateEventDto) {

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: dto,
    });

    return updatedEvent;
  }

  remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}