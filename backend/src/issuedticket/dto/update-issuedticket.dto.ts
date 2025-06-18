import { PartialType } from '@nestjs/mapped-types';
import { CreateIssuedTicketDto } from './create-issuedticket.dto';

export class UpdateIssuedTicketDto extends PartialType(CreateIssuedTicketDto) {}
