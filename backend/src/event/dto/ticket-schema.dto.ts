import { TicketClassDto } from './ticket-class.dto';

export class TicketSchemaDto {
  eventId: string;
  classes: TicketClassDto[];
}
