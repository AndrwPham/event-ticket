export class CreateOrderDto {
  userId: string;
  ticketItemIds: string[];
  totalPrice: number;
  status: string;
  method: string;
}
