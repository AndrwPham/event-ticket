import {Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    const { tagIds, organizationId, imageIds, tickets, ...eventData } = dto;

    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        organization: { connect: { id: organizationId } },
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

            if (Class !== ticketClass) {
              throw new Error(`SeatMapDesign Class (${Class}) must match ticket class (${ticketClass})`);
            }

            const [startX, startY] = StartCoordinate;
            const [endX, endY] = EndCoordinate;
            const rows = endY - startY + 1;
            const cols = endX - startX + 1;

            const ticketData: Prisma.IssuedTicketCreateWithoutEventInput[] = [];
            let count = 0;
            for (let y = startY; y <= endY && count < quantity; y++) {
              const rowLetter = String.fromCharCode(65 + y - startY);
              for (let x = startX; x <= endX && count < quantity; x++) {
                const seatId = `${rowLetter}-${x}`;
                ticketData.push({
                  price,
                  class: ticketClass,
                  seat: seatId,
                  status,
                  organization: { connect: { id: organizationId } },
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
        organization: true,
      },
    });

    return event;
  }

  async findAll() {
    const now = new Date();
    return this.prisma.event.findMany({
      where: {
        // Find events where the sale period is still active
        sale_start_date: { lte: now },
        sale_end_date: { gte: now },
      },
      include: {
        images: {
          where: { type: 'banner' },
          take: 1,
        },
        venue: true,
      },
      orderBy: {
        active_start_date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        tickets: { orderBy: { price: 'asc' } },
        venue: true,
        images: { where: { type: 'banner' } },
        organization: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findByTag(tagId: string) {
    return this.prisma.event.findMany({
      where: { tagIds: { has: tagId } },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organization: true,
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
        organization: true,
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
        organization: true,
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
        organization: true,
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    const { tagIds, organizationId, imageIds, tickets, ...eventData } = dto;

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        organization: organizationId ? { connect: { id: organizationId } } : undefined,
        tags: {
          set: [],
          connect: tagIds?.map((id) => ({ id })) || [],
        },
        images: {
          set: [],
          connect: imageIds?.map((id) => ({ id })) || [],
        },
        tickets: tickets
          ? {
              deleteMany: {}, // Clear existing tickets
              create: tickets.flatMap((ticket): Prisma.IssuedTicketCreateWithoutEventInput[] => {
                const { seatMapDesign, price, class: ticketClass, status, currencyId, quantity } = ticket;
                const { StartCoordinate, EndCoordinate, Class } = seatMapDesign;

                if (Class !== ticketClass) {
                  throw new Error(`SeatMapDesign Class (${Class}) must match ticket class (${ticketClass})`);
                }

                const [startX, startY] = StartCoordinate;
                const [endX, endY] = EndCoordinate;
                const rows = endY - startY + 1;
                const cols = endX - startX + 1;

                const ticketData: Prisma.IssuedTicketCreateWithoutEventInput[] = [];
                let count = 0;
                for (let y = startY; y <= endY && count < quantity; y++) {
                  const rowLetter = String.fromCharCode(65 + y - startY);
                  for (let x = startX; x <= endX && count < quantity; x++) {
                    const seatId = `${rowLetter}-${x}`;
                    ticketData.push({
                      price,
                      class: ticketClass,
                      seat: seatId,
                      status,
                      organization: { connect: { id: organizationId } },
                      currency: { connect: { id: currencyId } },
                    });
                    count++;
                  }
                }

                return ticketData;
              }),
            }
          : undefined,
      },
      include: {
        images: true,
        tickets: true,
        tags: true,
        organization: true,
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