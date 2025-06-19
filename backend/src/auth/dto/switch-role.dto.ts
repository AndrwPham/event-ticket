import { IsEnum } from 'class-validator';
import { Role } from '../types/role.enum';

export class SwitchRoleDto {
  @IsEnum(Role) activeRole: Role;
}