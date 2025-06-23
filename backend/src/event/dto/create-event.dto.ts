import { TicketSchemaDto } from './ticket-schema.dto';
import { IsDate, IsEnum, IsNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDate()
    @Type(() => Date)
    active_start_date: Date;

    @IsDate()
    @Type(() => Date)
    active_end_date: Date;

    @IsDate()
    @Type(() => Date)
    sale_start_date: Date;

    @IsDate()
    @Type(() => Date)
    sale_end_date: Date;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    ward?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsEnum(EventType)
    type: EventType;

    @IsString()
    @IsOptional()
    currency?: string // "VND"

    @IsString()
    organizationId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tagNames?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageIds?: string[];

    @IsNotEmpty()
    @Type(() => TicketSchemaDto)
    ticketSchema: TicketSchemaDto;
}
