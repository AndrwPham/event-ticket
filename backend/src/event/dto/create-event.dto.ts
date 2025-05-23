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
  categoryIds: string[];
  organizerIds: string[];
  imageId: string[];
}
