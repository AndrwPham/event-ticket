import { ClaimedTicketStatus } from '../claimedticket-status.enum';

export class BatchCreateClaimedTicketDto {
  orderId: string;
  attendeeId: string;
  ticketIds: string[];
  status?: ClaimedTicketStatus;
}
