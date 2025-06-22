import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus } from '../event/types/event-status.enum';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    async getDashboardStats() {
        const pendingEvents = await this.prisma.event.count({
            where: { status: EventStatus.PENDING },
        });
        const approvedEvents = await this.prisma.event.count({
            where: { status: EventStatus.APPROVED },
        });
        const userCount = await this.prisma.user.count();

        return {
            pendingEvents,
            approvedEvents,
            userCount,
        };
    }

    async getPendingEvents() {
        return this.prisma.event.findMany({
            where: { status: EventStatus.PENDING },
            include: {
                organization: {
                    select: { name: true }, // Include organization name for context
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async validateEvent(eventId: string, status: EventStatus) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        return this.prisma.event.update({
            where: { id: eventId },
            data: { status },
        });
    }
}