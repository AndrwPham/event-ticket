import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma, Tag, Currency } from '@prisma/client';
import { GenerateIssuedTicketsDto } from '../issuedticket/dto/generate-issued-tickets.dto';

@Injectable()
export class EventService {
    constructor(
        private prisma: PrismaService,
        private issuedTicketService: IssuedTicketService,
    ) {}

    async create(dto: CreateEventDto) {
        const { currency, ticketSchema, organizationId, ...eventData } = dto;

        try {
            // // Handle tags: create new ones or connect existing
            // let resolvedTagIds: string[] = [];
            // if (tagNames?.length) {
            //   const createdTags = await this.createOrGetTags(tagNames);
            //   resolvedTagIds = createdTags.map(tag => tag.id);
            // }

            // Start a transaction for event creation and related operations

            let currencyRecord: Currency | null = null;
            try {
                currencyRecord = await this.prisma.currency.findFirst({
                    where: { symbol: currency ? currency.toUpperCase() : "VND" },
                }); //could be wrong currency

                if (!currencyRecord) {
                    currencyRecord = await this.prisma.currency.findFirst({
                        where: { symbol: "VND" }
                    });
                    throw new BadRequestException('Unsupported currency');
                }
            } catch (err) {
                console.error(err.message);
            }

            const event = await this.prisma.$transaction(async (prisma) => {
                // Create the event
                const createdEvent = await prisma.event.create({
                    data: {
                        ...eventData,
                        organization: { connect: { id: organizationId } },
                        // tags: {
                        //   connect: resolvedTagIds.map((id) => ({ id })),
                        // },
                        // images: {
                        //   connect: imageIds?.map((id) => ({ id })) || [],
                        // },
                    }
                });

                const ticketDto: GenerateIssuedTicketsDto = {
                    eventId: createdEvent.id,
                    organizationId,
                    currencyId: currencyRecord?.id ?? "VND", // Assuming all tickets use the same currency
                    schema: ticketSchema
                };

                await this.issuedTicketService.generateTicketsFromSchema(ticketDto);

                return createdEvent;
            });

            return event;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Related record not found (organization, tags, or images).');
            }
            throw new BadRequestException(error.message || 'Failed to create event.');
        }
    }

    async createOrGetTags(tagNames: string[]): Promise<Tag[]> {
        const tags: Tag[] = [];

        for (const name of tagNames) {
            const existingTag = await this.prisma.tag.findUnique({ where: { name } });
            if (existingTag) {
                tags.push(existingTag);
            } else {
                const newTag = await this.prisma.tag.create({
                    data: { name },
                });
                tags.push(newTag);
            }
        }

        return tags;
    }

    async findAll() {
        try {
            return await this.prisma.event.findMany({
                include: {
                    images: true,
                    tickets: true,
                    tags: true,
                    organization: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch events.');
        }
    }

    async findOne(id: string) {
        try {
            const event = await this.prisma.event.findUnique({
                where: { id },
                include: {
                    images: true,
                    tickets: true,
                    tags: true,
                    organization: true,
                },
            });
            if (!event) throw new NotFoundException('Event not found.');
            return event;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to fetch event.');
        }
    }

    async findByTag(tagId: string) {
        try {
            return await this.prisma.event.findMany({
                where: { tagIds: { has: tagId } },
                include: {
                    images: true,
                    tickets: true,
                    tags: true,
                    organization: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch events by tag.');
        }
    }

    async findByCity(city: string) {
        try {
            return await this.prisma.event.findMany({
                where: { city },
                include: {
                    images: true,
                    tickets: true,
                    tags: true,
                    organization: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch events by city.');
        }
    }

    async findByDistrict(district: string) {
        try {
            return await this.prisma.event.findMany({
                where: { district },
                include: {
                    images: true,
                    tickets: true,
                    tags: true,
                    organization: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch events by district.');
        }
    }

    async findByWard(ward: string) {
        try {
            return await this.prisma.event.findMany({
                where: { ward },
                include: {
                    images: true,
                    tickets: true,
                    tags: true,
                    organization: true,
                },
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch events by ward.');
        }
    }

    //update event

    async remove(id: string) {
        try {
            return await this.prisma.event.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Event not found.');
            }
            throw new BadRequestException(error.message || 'Failed to delete event.');
        }
    }
}
