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
  organizerId: string;
  imageIds: string[];

}
