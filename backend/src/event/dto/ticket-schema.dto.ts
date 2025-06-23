import { TicketClassDto } from './ticket-class.dto';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TicketSchemaDto {
    @IsOptional()
    @IsString()
    eventId?: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() =>  TicketClassDto)
    classes: TicketClassDto[];
}
