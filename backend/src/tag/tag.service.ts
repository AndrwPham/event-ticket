import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<{ id: string, name: string }[]> {
        return this.prisma.tag.findMany({});
    }

    findOne(id: string) {
        return this.prisma.tag.findUnique({
            where: { id },
        });
    }
}
