import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { ImageService } from '../image/image.service';
import { Prisma, Tag, Currency } from '@prisma/client';
import { GenerateIssuedTicketsDto } from '../issuedticket/dto/generate-issued-tickets.dto';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateImageDto } from '../image/dto/create-image.dto';

@Injectable()
export class EventService {
    constructor(
        private prisma: PrismaService,
        private issuedTicketService: IssuedTicketService,
        private imageService: ImageService,
    ) {}

    async create(dto: CreateEventDto) {
        const { currency, ticketSchema, organizationId, tagIds, posterImage, images, ...eventData } = dto;

        try {
            const [resolvedTagIds, posterId, imageIds, currencyRecord] = await Promise.all([
                tagIds?.length ? this.validateTagIds(tagIds) : [],
                this.saveOneImage(posterImage),
                images?.length ? this.saveImages(images) : [],
                this.resolveCurrency(currency),
            ]);

            const event = await this.prisma.$transaction(async (prisma) => {
                // Create the event
                const createdEvent = await prisma.event.create({
                    data: {
                        ...eventData,
                        organization: { connect: { id: organizationId } },
                        tagIds: resolvedTagIds,
                        posterId,
                        imageIds,
                    }
                });

                const ticketDto: GenerateIssuedTicketsDto = {
                    eventId: createdEvent.id,
                    organizationId,
                    currencyId: currencyRecord.id, // Assuming all tickets use the same currency
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
            console.error(error.message);
            throw new BadRequestException(error.message || 'Failed to create event.');
        }
    }

    private async validateTagIds(tagIds: string[]): Promise<string[]> {
        const existingTags = await this.prisma.tag.findMany({
            where: { id: { in: tagIds } },
            select: { id: true }
        });

        if (existingTags.length !== tagIds.length) {
            throw new BadRequestException("One or more tagIds are invalid or not found");
        }

        return existingTags.map(tag => tag.id);
    }

    private async saveImages(images: any[]): Promise<string[]> {
        const dtos = images.map((img) => plainToInstance(CreateImageDto, img));
        const saved = await this.imageService.createMany(dtos);
        return saved.map(img => img.id);
    }

    private async saveOneImage(image): Promise<string> {
        const dto = plainToInstance(CreateImageDto, image);
        const saved = await this.imageService.create(dto);
        return saved.id;
    }

    private async resolveCurrency(symbol?: string): Promise<Currency> {
        const resolvedSymbol = symbol?.toUpperCase() ?? "VND";
        const currency = await this.prisma.currency.findFirst({ where: { symbol: resolvedSymbol } });

        if (!currency) {
            throw new BadRequestException(`Unsupported currency: ${resolvedSymbol}`);
        }

        return currency;
    }
}

//TODO:fix all related tagIds and imageIds relation

// async findAll() {
//     try {
//         return await this.prisma.event.findMany({
//             include: {
//                 images: true,
//                 tickets: true,
//                 organization: true,
//             },
//         });
//     } catch (error) {
//         throw new InternalServerErrorException('Failed to fetch events.');
//     }
// }
//
// async findOne(id: string) {
//     try {
//         const event = await this.prisma.event.findUnique({
//             where: { id },
//             include: {
//                 images: true,
//                 tickets: true,
//                 organization: true,
//             },
//         });
//         if (!event) throw new NotFoundException('Event not found.');
//         return event;
//     } catch (error) {
//         if (error instanceof NotFoundException) throw error;
//         throw new InternalServerErrorException('Failed to fetch event.');
//     }
// }
//
// async findByTag(tagId: string) {
//     try {
//         return await this.prisma.event.findMany({
//             where: { tagIds: { has: tagId } },
//             include: {
//                 images: true,
//                 tickets: true,
//                 organization: true,
//             },
//         });
//     } catch (error) {
//         throw new InternalServerErrorException('Failed to fetch events by tag.');
//     }
// }
//
// async findByCity(city: string) {
//     try {
//         return await this.prisma.event.findMany({
//             where: { city },
//             include: {
//                 images: true,
//                 tickets: true,
//                 organization: true,
//             },
//         });
//     } catch (error) {
//         throw new InternalServerErrorException('Failed to fetch events by city.');
//     }
// }
//
// async findByDistrict(district: string) {
//     try {
//         return await this.prisma.event.findMany({
//             where: { district },
//             include: {
//                 images: true,
//                 tickets: true,
//                 organization: true,
//             },
//         });
//     } catch (error) {
//         throw new InternalServerErrorException('Failed to fetch events by district.');
//     }
// }
//
// async findByWard(ward: string) {
//     try {
//         return await this.prisma.event.findMany({
//             where: { ward },
//             include: {
//                 images: true,
//                 tickets: true,
//                 organization: true,
//             },
//         });
//     } catch (error) {
//         throw new InternalServerErrorException('Failed to fetch events by ward.');
//     }
// }
//
// //update event
//
// async remove(id: string) {
//     try {
//         return await this.prisma.event.delete({
//             where: { id },
//         });
//     } catch (error) {
//         if (error.code === 'P2025') {
//             throw new NotFoundException('Event not found.');
//         }
//         throw new BadRequestException(error.message || 'Failed to delete event.');
//     }
// }
