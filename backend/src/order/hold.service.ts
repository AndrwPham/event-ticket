import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

const HOLD_TTL = 300; // 5 minutes

@Injectable()
export class HoldService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * Place holds on multiple tickets for a given attendee.
   * Throws ConflictException if any ticket is already held.
   */
  async holdTickets(ticketIds: string[], attendeeId: string): Promise<void> {
    for (const ticketId of ticketIds) {
      const key = `hold:${ticketId}`;
      const result = await this.redis.set(key, attendeeId, 'EX', HOLD_TTL, 'NX');
      if (result !== 'OK') {
        await this.releaseTickets(ticketIds.slice(0, ticketIds.indexOf(ticketId)));
        throw new ConflictException(`Ticket ${ticketId} is currently held by another user.`);
      }
    }
  }

  /**
   * Release holds for the given tickets.
   */
  async releaseTickets(ticketIds: string[]): Promise<void> {
    if (ticketIds.length === 0) return;
    const keys = ticketIds.map((id) => `hold:${id}`);
    await this.redis.del(...keys);
  }

  /**
   * Check if a ticket is currently held.
   */
  async isHeld(ticketId: string): Promise<boolean> {
    const key = `hold:${ticketId}`;
    const exists = await this.redis.exists(key);
    return exists === 1;
  }
}
