export class CreateIssuedTicketDto {
  name: string;
  price: number;
  quantity: number;
  class: string;
  status: "available" | "unavailable";
  eventId: string;
  seat: string;
  attendeeId?: string;
  ticketId?: string;
}
