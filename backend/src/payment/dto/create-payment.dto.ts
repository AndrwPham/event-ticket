import { IsString, IsNumber, IsArray, ArrayNotEmpty, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentItemDto {
    @IsString()
    id: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;
}

export class CreatePaymentDto {
    @IsString()
    orderCode: string;

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
}
