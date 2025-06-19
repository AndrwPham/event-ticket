import { OrderStatus } from '../order-status.enum';
import { IsEnum, IsString, IsArray, IsOptional, IsEmail } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  ticketItems: string[];

  // Guest checkout fields
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  guestName?: string;
}
