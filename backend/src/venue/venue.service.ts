import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Venue } from '@prisma/client';

@Injectable()
export class VenueService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Venue[]> {
        const venues = await this.prisma.venue.findMany();

        return venues;
    }
}
