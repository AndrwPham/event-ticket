export class CreateOrderDto {
  totalPrice: number;
  status: string;
  method: string;
  userId: string;
  ticketItems: string[];
}
