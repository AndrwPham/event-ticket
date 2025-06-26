import { SeatDto } from './seat.dto';
import { IsNotEmpty, IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TicketClassDto {
    @IsNotEmpty()
    @IsString()
    label: string;
    
    @IsOptional()
    @IsString()
    description?: string;
    // description for each class should be added to schema

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => SeatDto)
    seats?: SeatDto[];
}
