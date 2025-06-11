export class CreateTicketDto {
  name: string;
  price: number;
  quantity: number;
  class: string;
  status: "available" | "unavailable";
  eventId: string;
}
