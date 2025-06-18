import { Role } from './role.enum';

export type JwtPayload = {
  sub: string;
  roles: Role[];
  activeRole: Role;
};
