import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { ImageService } from '../image/image.service';
import {Prisma, Tag, Currency, EventStatus} from '@prisma/client';
import { GenerateIssuedTicketsDto } from '../issuedticket/dto/generate-issued-tickets.dto';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { GetFileDto } from '../common/aws/dto/get-file.dto';

@Injectable()
export class EventService {
    constructor(
        private prisma: PrismaService,
        private issuedTicketService: IssuedTicketService,
        private imageService: ImageService,
    ) {}

    async create(dto: CreateEventDto) {
        // WARN: currency seems no use?
        const { currency, venueId, ticketSchema, organizationId, tagIds, posterImage, images, ...eventData } = dto;

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
                        ticketSchema: ticketSchema ? instanceToPlain(ticketSchema) : undefined,
                    }
                });

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

    async findAll() {
        const events = await this.prisma.event.findMany();
        let imageIds: string[] = [];

        // 1. Collect all unique keys: posterId + imageIds
        events.forEach((event) => {
            if (event.posterId) imageIds.push(event.posterId);
            if (event.imageIds?.length) {
                event.imageIds.forEach((id) => imageIds.push(id));
            }
        });
        const images = await this.imageService.getByIds(imageIds);
        const imageIdToKey = new Map(images.map(img => [img.id, img.key]));
        
        const getFileDtos: GetFileDto[] = Array.from(images).map((img) => ({
            key: img.key,
            isPublic: true,
        }));

        // 2. Fetch signed/public URLs
        const fileResults = await this.imageService.getPublicOrSignedUrls(getFileDtos);

        // 3. Map key => URL
        const keyToUrl = new Map(fileResults
            .filter(res => res.status === 'ok' && res.url)
            .map(res => [res.key, res.url!])
        );

        // 4. Construct simplified output
        const imageIdToUrl = new Map<string, string>();
        images.forEach((img) => {
            const url = keyToUrl.get(img.key);
            if (url) imageIdToUrl.set(img.id, url);
        });

        const enrichedEvents = events.map(event => ({
            ...event,
            posterImage: event.posterId ? imageIdToUrl.get(event.posterId) ?? null : null,
            otherImages: event.imageIds?.map(id => imageIdToUrl.get(id)).filter(Boolean) ?? [],
        }));

        return enrichedEvents;
    }
}

//TODO:fix all related tagIds and imageIds relation

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
