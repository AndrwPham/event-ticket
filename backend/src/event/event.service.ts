import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    const { categoryIds, organizerIds, ...eventData } = dto;

    const event = await this.prisma.event.create({
      data: eventData,
    });

    const eventCategoryLinks = await Promise.all(
      categoryIds.map((categoryId) =>
        this.prisma.eventCategory.create({
          data: {
            eventId: event.id,
            categoryId,
          },
        })
      )
    );

    const eventOrganizerLinks = await Promise.all(
      organizerIds.map((userId) =>
        this.prisma.eventOrganizer.create({
          data: {
            eventId: event.id,
            userId,
          },
        })
      )
    );

    return {
      event,
      eventCategoryLinks,
      eventOrganizerLinks,
    };
  }

  findAll() {
    return this.prisma.event.findMany({
      include: {
        images: true,
        tickets: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        images: true,
        tickets: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findByCategory(categoryId: string) {
    const eventCategories = await this.prisma.eventCategory.findMany({
      where: { categoryId },
      include: {
        event: {
          include: {
            images: true,
            tickets: true,
            categories: {
              include: { category: true },
            },
          },
        },
      },
    });

    return eventCategories.map((ec) => ec.event);
  }

  findByCity(city: string) {
    return this.prisma.event.findMany({
      where: { city },
      include: {
        images: true,
        tickets: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  findByDistrict(district: string) {
    return this.prisma.event.findMany({
      where: { district },
      include: {
        images: true,
        tickets: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  findByWard(ward: string) {
    return this.prisma.event.findMany({
      where: { ward },
      include: {
        images: true,
        tickets: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: CreateEventDto) {
    const { categoryIds, ...eventData } = dto;

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: eventData,
    });

    await this.prisma.eventCategory.deleteMany({ where: { eventId: id } });

    const newLinks = await Promise.all(
      categoryIds.map((categoryId) =>
        this.prisma.eventCategory.create({
          data: {
            eventId: id,
            categoryId,
          },
        })
      )
    );

    return {
      updatedEvent,
      updatedEventCategories: newLinks,
    };
  }

  remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
