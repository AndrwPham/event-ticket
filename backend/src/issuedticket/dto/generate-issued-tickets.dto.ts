import { TicketSchemaDto } from 'src/event/dto/ticket-schema.dto';

export class GenerateIssuedTicketsDto {
  eventId: string;
  organizationId: string;
  currencyId: string;
  schema: TicketSchemaDto;
}
