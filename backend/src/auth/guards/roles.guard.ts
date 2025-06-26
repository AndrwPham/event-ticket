import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { INCLUDE_ROLES_KEY } from '../decorators/include-roles.decorator';
import { EXCLUDE_ROLES_KEY } from '../decorators/exclude-roles.decorator';
import { Role } from '../types/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        // Bypass if DISABLE_AUTH is true
        const isBypassEnabled = this.configService.get('DISABLE_AUTH') === 'true';
        if (isBypassEnabled) return true;
        const includeRoles = this.reflector.getAllAndOverride<Role[]>(INCLUDE_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const excludeRoles = this.reflector.getAllAndOverride<Role[]>(EXCLUDE_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.roles) {
            throw new ForbiddenException('No user roles found');
        }

        if (includeRoles && includeRoles.length > 0) {
            if (!user.roles.some((role: Role) => includeRoles.includes(role))) {
                throw new ForbiddenException('Insufficient role');
            }
        }

        if (excludeRoles && excludeRoles.length > 0) {
            if (user.roles.some((role: Role) => excludeRoles.includes(role))) {
                throw new ForbiddenException('Role is excluded');
            }
        }
        return true;
    }
}
