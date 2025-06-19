import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/role.enum';

export const EXCLUDE_ROLES_KEY = 'excludeRoles';
export const ExcludeRoles = (...roles: Role[]) => SetMetadata(EXCLUDE_ROLES_KEY, roles);
