import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';

const HOLD_TTL = 600; // 10 minutes (strict industry standard)

@Injectable()
export class HoldService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Place holds on multiple tickets for a given attendee.
   * Throws ConflictException if any ticket is already held or hold has not expired.
   */
  async holdTickets(ticketIds: string[], attendeeId: string): Promise<void> {
    const now = new Date();
    const holdExpiresAt = new Date(now.getTime() + HOLD_TTL * 1000);
    for (const ticketId of ticketIds) {
      // check DB holdExpiresAt
      const ticket = await this.prisma.issuedTicket.findUnique({ where: { id: ticketId } });
      if (ticket?.holdExpiresAt && ticket.holdExpiresAt > now) {
        throw new ConflictException(`Ticket ${ticketId} is currently held (DB).`);
      }
      // set Redis hold
      const key = `hold:${ticketId}`;
      const result = await this.redis.set(key, attendeeId, 'EX', HOLD_TTL, 'NX');
      if (result !== 'OK') {
        await this.releaseTickets(ticketIds.slice(0, ticketIds.indexOf(ticketId)));
        throw new ConflictException(`Ticket ${ticketId} is currently held (Redis).`);
      }
      // set DB holdExpiresAt
      await this.prisma.issuedTicket.update({
        where: { id: ticketId },
        data: { holdExpiresAt },
      });
    }
  }

  /**
   * Release holds for the given tickets.
   */
  async releaseTickets(ticketIds: string[]): Promise<void> {
    if (ticketIds.length === 0) return;
    const keys = ticketIds.map((id) => `hold:${id}`);
    await this.redis.del(...keys);
    // Clear DB holdExpiresAt
    await this.prisma.issuedTicket.updateMany({
      where: { id: { in: ticketIds } },
      data: { holdExpiresAt: null },
    });
  }

  /**
   * Check if a ticket is currently held (Redis or DB).
   */
  async isHeld(ticketId: string): Promise<boolean> {
    const key = `hold:${ticketId}`;
    const exists = await this.redis.exists(key);
    if (exists === 1) return true;
    // Check DB holdExpiresAt
    const ticket = await this.prisma.issuedTicket.findUnique({ where: { id: ticketId } });
    if (ticket?.holdExpiresAt && ticket.holdExpiresAt > new Date()) return true;
    return false;
  }
}
