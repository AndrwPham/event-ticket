import { IsEnum, IsString, IsArray, IsOptional } from 'class-validator';
import { OrderStatus } from '../order-status.enum';

export class UpdateOrderDto {
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