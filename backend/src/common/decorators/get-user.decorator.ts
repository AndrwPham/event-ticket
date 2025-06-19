import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithRoles } from 'src/auth/types/request-with-user.interface';

export const GetUser = createParamDecorator(
  (data: keyof UserWithRoles | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserWithRoles;
    return data ? user[data] : user;
  },
);