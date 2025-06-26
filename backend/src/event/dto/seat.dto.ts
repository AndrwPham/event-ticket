import { IsOptional, IsNumber, IsString } from 'class-validator';

export class SeatDto {
    @IsString()
    seatNumber: string;

    @IsNumber()
    @IsOptional()
    price?: number;
}
