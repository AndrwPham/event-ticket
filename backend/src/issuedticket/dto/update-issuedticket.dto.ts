import { PartialType } from '@nestjs/mapped-types';
import { CreateIssuedTicketDto } from './create-issuedticket.dto';

export class UpdateTicketDto extends PartialType(CreateIssuedTicketDto) {}
