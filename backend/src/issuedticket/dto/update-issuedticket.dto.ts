import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-issuedticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
