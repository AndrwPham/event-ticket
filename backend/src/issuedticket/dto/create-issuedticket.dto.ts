export class CreateIssuedTicketDto {
  name: string;
  price: number;
  quantity: number;
  class: string;
  eventId: string;
  seat: string;
  attendeeId?: string;
  ticketId?: string;
  organizerId?: string;
  currencyId?: string;
}
