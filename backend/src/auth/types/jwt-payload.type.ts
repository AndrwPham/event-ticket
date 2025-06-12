// src/auth/types/jwt-payload.type.ts
export type JwtPayload = {
  sub: string; // Usually the user ID
  role: 'Attendee' | 'Organizer'; // User role
};
