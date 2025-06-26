import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus } from '../event/types/event-status.enum';
import { IssuedTicketService } from '../issuedticket/issuedticket.service';
import { TicketSchemaDto } from '../event/dto/ticket-schema.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly issuedTicketService: IssuedTicketService,
    ) {}

    async getDashboardStats() {
        const pendingEvents = await this.prisma.event.count({
            where: { status: EventStatus.PENDING },
        });
        const approvedEvents = await this.prisma.event.count({
            where: { status: EventStatus.APPROVED },
        });
        const userCount = await this.prisma.user.count();

        return { pendingEvents, approvedEvents, userCount };
    }

    async getPendingEvents() {
        console.log('[AdminService] findPendingEvents()');
        const evts = await this.prisma.event.findMany({
            where: { status: EventStatus.PENDING },
            include: { organization: true },
            orderBy: { createdAt: 'desc' },
        });
        console.log('[AdminService] retrieved', evts.length, 'events');
        return evts;
    }

    async validateEvent(eventId: string, status: EventStatus) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const updated = await this.prisma.event.update({
            where: { id: eventId },
            data: { status },
        });

        if (status === EventStatus.APPROVED && event.ticketSchema) {
            try {
                const currency = await this.prisma.currency.findFirst({
                    where: { symbol: 'VND' },
                });
                if (!currency) {
                    throw new InternalServerErrorException('Default currency not found');
                }

                // —— cast via unknown to satisfy TS ——
                const schema = event.ticketSchema as unknown as TicketSchemaDto;

                await this.issuedTicketService.generateTicketsFromSchema({
                    eventId:        event.id,
                    organizationId: event.organizationId,
                    currencyId:     currency.id,
                    schema,  // now typed as TicketSchemaDto
                });
            } catch (error) {
                throw new InternalServerErrorException(
                    'Failed to generate issued tickets',
                );
            }
        }

        return updated;
    }
}
