export class CreateEventDto {
  title: string;
  description: string;
  active_start_date: Date;
  active_end_date: Date;
  sale_start_date: Date;
  sale_end_date: Date;
  city?: string;
  ward?: string;
  street?: string;
  district?: string;
  type: string;
  tagIds: string[];
  organizationId: string;
  imageIds: string[];
  tickets: {
    price: number;
    class: string;
    status: "AVAILABLE" | "UNAVAILABLE";
    organizationId: string; // Organizer ID for the ticke
    eventId: string; // Event ID for the ticket
    currencyId: string;
    quantity: number; // Number of tickets to create within the seat map
    seatMapDesign: {
      StartCoordinate: [number, number];
      EndCoordinate: [number, number];
      Class: string;
    };
  }[];
}