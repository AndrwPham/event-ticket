export class CreateEventDto {
  title: string;
  description: string;
  date: Date;
  city?: string;
  district?: string;
  ward?: string;
  street?: string;
  userId: string;
  categoryId: string;
}
