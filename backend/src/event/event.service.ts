import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    const { tagIds, organizerId, imageIds, tickets, ...eventData } = dto;

    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        organizer: { connect: { id: organizerId } },
        tags: {
          connect: tagIds?.map((id) => ({ id })) || [],
        },
        images: {
          connect: imageIds?.map((id) => ({ id })) || [],
        },
        tickets: {
          create: tickets?.flatMap((ticket): Prisma.IssuedTicketCreateWithoutEventInput[] => {
            const { seatMapDesign, price, class: ticketClass, status, currencyId, quantity } = ticket;
            const { StartCoordinate, EndCoordinate, Class } = seatMapDesign;

            // Validate class consistency
            if (Class !== ticketClass) {
              throw new Error(`SeatMapDesign Class (${Class}) must match ticket class (${ticketClass})`);
            }

            // Calculate grid dimensions
            const [startX, startY] = StartCoordinate;
            const [endX, endY] = EndCoordinate;
            const rows = endY - startY + 1;
            const cols = endX - startX + 1;

            // Generate seat IDs (e.g., A-0, A-1, ..., B-0, ...)
            const ticketData: Prisma.IssuedTicketCreateWithoutEventInput[] = [];
            let count = 0;
            for (let y = startY; y <= endY && count < quantity; y++) {
              const rowLetter = String.fromCharCode(65 + y - startY); // A, B, C, ...
              for (let x = startX; x <= endX && count < quantity; x++) {
                const seatId = `${rowLetter}-${x}`;
                ticketData.push({
                  price,
                  class: ticketClass,
                  seat: seatId,
                  status,
                  organizer: { connect: { id: organizerId } },
                  currency: { connect: { id: currencyId } },
                });
                count++;
              }
            }

            return ticketData;
          }) || [],
        },
      },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organizer: true,
      },
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

  async update(id: string, dto: UpdateEventDto) {
    const { tagIds, organizerId, imageIds, ...eventData } = dto;

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        organizer: { connect: { id: organizerId } },
        tags: {
          set: [],
          connect: tagIds?.map((id) => ({ id })) || [],
        },
        images: {
          set: [],
          connect: imageIds?.map((id) => ({ id })) || [],
        },
      },
    });

    return updatedEvent;
  }

  remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}