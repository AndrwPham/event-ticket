import { Injectable } from '@nestjs/common';
import { OrderCompletedEvent } from '../events/order-completed.event';
import { ClaimedTicketService } from '../../claimedticket/claimedticket.service';
import { IssuedTicketService } from '../../issuedticket/issuedticket.service';

@Injectable()
export class TicketDeliveryHandler {
  constructor(
    private readonly claimedTicketService: ClaimedTicketService,
    private readonly issuedTicketService: IssuedTicketService,
  ) {}

  async handle(event: OrderCompletedEvent) {
    const claimedTickets = await this.claimedTicketService.findByOrder(event.orderId);
    const ticketPayloads = claimedTickets.map(ct => {
      const issued = ct.issuedTicket;
      const attendee = ct.attendee;
      const name = [attendee?.first_name, attendee?.last_name].filter(Boolean).join(' ');
      return {
        email: attendee?.email,
        name,
        code: issued?.id, // Use the issued ticket's id (ticketId) as the code for QR/barcode
        serial: issued?.id,
        class: issued?.class,
        seat: issued?.seat,
        event: issued?.eventId,
        price: issued?.price,
        status: ct.status,
      };
    });
    return ticketPayloads;
  }
}
