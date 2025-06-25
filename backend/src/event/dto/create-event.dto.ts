import { IsMongoId, IsDate, IsEnum, IsNotEmpty, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketSchemaDto } from './ticket-schema.dto';
import { CreateImageDto } from '../../image/dto/create-image.dto';
import { EventType } from '@prisma/client';

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
    @IsMongoId({ each: true })
    tagIds?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateImageDto)
    images?: CreateImageDto[];

    @IsNotEmpty()
    @Type(() => TicketSchemaDto)
    ticketSchema: TicketSchemaDto;
}
