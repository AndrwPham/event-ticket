import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { TicketStatus } from '../issuedticket/ticket-status.enum';

@Injectable()
export class TicketCleanupService {
  private readonly logger = new Logger(TicketCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async releaseExpiredHolds() {
    const now = new Date();
    const expiredTickets = await this.prisma.issuedTicket.findMany({
      where: {
        status: TicketStatus.HELD,
        holdExpiresAt: { lt: now },
      },
    });
    if (expiredTickets.length === 0) return;
    const ticketIds = expiredTickets.map(t => t.id);
    await this.prisma.issuedTicket.updateMany({
      where: { id: { in: ticketIds } },
      data: { status: TicketStatus.AVAILABLE, holdExpiresAt: null },
    });
    this.logger.log(`Released ${ticketIds.length} expired held tickets`);
  }
}
