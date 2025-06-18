export class TicketClassDto {
  label: string;
  description?: string;
  price: number;
  quantity: number;
  seatMap?: string;
  seats?: Array<{
    seatNumber: string;
    price: number;
  }>;
}
