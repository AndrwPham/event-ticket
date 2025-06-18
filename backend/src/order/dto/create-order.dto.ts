import { OrderStatus } from '../order-status.enum';
import { IsEnum, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateOrderDto {
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
