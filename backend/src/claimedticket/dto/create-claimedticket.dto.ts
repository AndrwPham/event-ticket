import { ClaimedTicketStatus } from '../claimedticket-status.enum';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateClaimedTicketDto {
  @IsString()
  attendeeId: string;

  @IsString()
  ticketId: string;

  @IsString()
  orderId: string;

  @IsOptional()
  @IsEnum(ClaimedTicketStatus)
  status?: ClaimedTicketStatus;
}
