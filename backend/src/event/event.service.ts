import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    return await this.prisma.event.create({
      data: {
        ...dto,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany({
      include: {
        images: true,
        category: true,
        tickets: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        tickets: true,
      },
    });
  }

  findbyCategory(categoryId: string) {
    return this.prisma.event.findMany({
      where: { 
        categoryId 
    },
      include: {
        images: true,
        category: true,
        tickets: true,
      },
    });
  }

  findbyCity(city: string) {
    return this.prisma.event.findMany({
      where: { 
        city 
    },
      include: {
        images: true,
        category: true,
        tickets: true,
      },
    });
  }

  findbyDistrict(district: string) {
    return this.prisma.event.findMany({
      where: { 
        district 
    },
      include: {
        images: true,
        category: true,
        tickets: true,
      },
    });
  }

  findbyWard(ward: string) {
    return this.prisma.event.findMany({
      where: { 
        ward 
    },
      include: {
        images: true,
        category: true,
        tickets: true,
      },
    });
  }

  update(id: string, dto: CreateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
