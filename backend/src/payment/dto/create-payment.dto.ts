import { IsString, IsNumber, IsArray, ArrayNotEmpty, IsUrl, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentItemDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;
}

export class CreatePaymentDto {
    @IsNumber()
    orderCode: number;

    @IsString()
    description: string;

    @IsNumber()
    amount: number;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PaymentItemDto)
    items: PaymentItemDto[];

    @IsUrl()
    returnUrl: string;

    @IsUrl()
    cancelUrl: string;

    @IsOptional()
    @IsString()
    buyerName?: string;

    @IsOptional()
    @IsString()
    buyerEmail?: string;

    @IsOptional()
    @IsString()
    buyerPhone?: string;

    @IsOptional()
    @IsString()
    buyerAddress?: string;

    @IsOptional()
    @IsNumber()
    expiredAt?: number;
}
