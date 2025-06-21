import { Injectable } from '@nestjs/common';
import { OrderCompletedEvent } from '../events/order-completed.event';
import { EmailProvider } from '../providers/email.provider';
import { renderTemplateFromFile } from './template.helper';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderReceiptHandler {
  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly prisma: PrismaService,
  ) {}

  async handle(event: OrderCompletedEvent) {
    const order = await this.prisma.order.findUnique({
      where: { id: event.orderId },
      include: {
        attendee: true,
        tickets: true,
      },
    });
    if (!order) throw new Error('Order not found');
    const attendee = order.attendee;
    const email = attendee?.email || event.guestEmail;
    if (!email) throw new Error('No email found for order receipt');
    
    const templateData = {
      name: attendee?.first_name || attendee?.last_name || '',
      orderId: order.id,
      createdAt: order.createdAt.toLocaleString(),
      method: order.method,
      totalPrice: order.totalPrice.toFixed(2),
      items: order.ticketItems,
    };
    const subject = `Your Order Receipt (#${order.id})`;
    const html = renderTemplateFromFile('order-receipt', templateData, 'html');
    const text = renderTemplateFromFile('order-receipt', templateData, 'txt');
    await this.emailProvider.sendEmail(email, subject, html, text);
  }
}
