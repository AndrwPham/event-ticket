export class CreateEventDto {
  title: string;
  description: string;
  active_start_date: Date;
  active_end_date: Date;
  sale_start_date: Date;
  sale_end_date: Date;
  city?: string;
  district?: string;
  ward?: string;
  street?: string;
  type: string;
  organizationId: string;
  tagNames?: string[];
  imageIds?: string[];
  tickets?: {
    price: number;
    class: string;
    seat: string;
    status?: string;
    holdExpiresAt?: Date;
    currencyId: string;
  }[];
}