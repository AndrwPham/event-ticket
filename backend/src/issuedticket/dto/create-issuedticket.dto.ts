import { TicketStatus } from '../ticket-status.enum';

export class CreateIssuedTicketDto {
  price: number;
  class: string;
  seat: string;
  status?: TicketStatus;
  eventId: string;
  organizationId: string;
  currencyId: string;
}
