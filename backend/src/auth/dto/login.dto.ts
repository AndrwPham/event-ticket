export class LoginDto {
  username: string;
  password: string;
  role: "Attendee" | "Organizer";
}
