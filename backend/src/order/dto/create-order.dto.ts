import { OrderStatus } from '../order-status.enum';
import { IsEnum, IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsString()
  method: string;

  @IsString()
  userId: string;

  @IsArray()
  ticketItems: string[];
}
