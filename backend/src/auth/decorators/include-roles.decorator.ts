import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/role.enum';

export const INCLUDE_ROLES_KEY = 'includeRoles';
export const IncludeRoles = (...roles: Role[]) => SetMetadata(INCLUDE_ROLES_KEY, roles);
