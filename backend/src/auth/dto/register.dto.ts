export class RegisterDto {
  email: string;
  password: string;
  username: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
  // first_name: string;
  // last_name: string;
  // role?: "USER" | "ORGANIZER" | "ADMIN";
  // phone?: string;
  // address?: string;
  // confirmed?: boolean;
}
