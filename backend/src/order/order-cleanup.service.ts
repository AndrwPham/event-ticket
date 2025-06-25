import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './order-status.enum';
import { PaymentService } from '../payment/payment.service';
import { OrderService } from './order.service';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredOrders() {
    const now = new Date();
    // Find all PENDING orders with at least one ticket whose holdExpiresAt is in the past
    const expiredOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        tickets: {
          some: {
            issuedTicket: {
              holdExpiresAt: { lt: now },
            },
          },
        },
      },
      include: { tickets: { include: { issuedTicket: true } } },
    });
    for (const order of expiredOrders) {
      try {
        this.orderService.cancel(order.id);
        this.logger.log(`Cancelled expired order ${order.id}`);
      } catch (err) {
        this.logger.error(`Failed to cancel order ${order.id}: ${err.message}`);
      }
    }
  }
}
