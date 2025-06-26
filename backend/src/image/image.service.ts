import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UploadFileDto } from '../common/aws/dto/upload-file.dto';
import { GetFileDto } from '../common/aws/dto/get-file.dto';
import { AWSService } from '../common/aws/aws.service';

import { Image } from '@prisma/client';

@Injectable()
export class ImageService {
    constructor(private prisma: PrismaService, private awsService: AWSService) {}

    async createMany(dtos: CreateImageDto[]): Promise<Image[]> {
        return Promise.all(dtos.map(dto => this.create(dto)));
    }

    async create(dto: CreateImageDto): Promise<Image> {
        return this.prisma.image.create({ data: {
            key: dto.key,
            contentType: dto.contentType,
            isPublic: dto.isPublic
        } });
    }

    // @UseGuards(JwtAuthGuard)
    generateUploadUrls(dtos: UploadFileDto[]) {
        return this.awsService.generateSignedPutUrl(dtos);
    }

    getPublicOrSignedUrls(dtos: GetFileDto[]) {
        return this.awsService.getFileUrl(dtos);
    }
    // findAll() {
    //     return this.prisma.image.findMany({
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findOne(id: string) {
    //     return this.prisma.image.findUnique({ 
    //         where: { id },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findByUserId(attendeeId: string) {
    //     return this.prisma.image.findMany({ 
    //         where: { attendeeId },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findByEventId(eventId: string) {
    //     return this.prisma.image.findMany({ 
    //         where: { eventId },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findByTicketId(ticketId: string) {
    //     return this.prisma.image.findMany({ 
    //         where: { ticketId },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findByUserIdAndType(attendeeId: string, type: string) {
    //     return this.prisma.image.findMany({ 
    //         where: { attendeeId, type },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findByEventIdAndType(eventId: string, type: string) {
    //     return this.prisma.image.findMany({ 
    //         where: { eventId, type },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }
    //
    // findByTicketIdAndType(ticketId: string, type: string) {
    //     return this.prisma.image.findMany({ 
    //         where: { ticketId, type },
    //         include: {
    //             attendee: true,
    //             event: true,
    //             ticket: true,
    //         },
    //     });
    // }

    // update(id: string, dto: CreateImageDto) {
    //     return this.prisma.image.update({ 
    //         where: { id }, 
    //         data: {
    //             key: dto.key,
    //             contentType: dto.type,
    //         },
    //     });
    // }
    //
    // remove(id: string) {
    //     return this.prisma.image.delete({ 
    //         where: { id },
    //     });
    // }
}
