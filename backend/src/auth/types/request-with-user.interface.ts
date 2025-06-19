import { Role } from './role.enum';

export interface UserWithRoles {
  userId:    string;
  username:  string;
  roles:     Role[];
  activeRole: Role;
}