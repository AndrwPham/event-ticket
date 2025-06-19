import { Test } from '@nestjs/testing';
import { IncludeRoles, INCLUDE_ROLES_KEY } from './include-roles.decorator';
import { ExcludeRoles, EXCLUDE_ROLES_KEY } from './exclude-roles.decorator';
import { Role } from '../types/role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('Role Decorators (NestJS integration)', () => {
  let controllerInstance: any;
  let proto: any;

  beforeAll(async () => {
    class MockController {
      @IncludeRoles(Role.Admin, Role.Organizer)
      include() {}

      @ExcludeRoles(Role.Attendee)
      exclude() {}
    }
    const moduleRef = await Test.createTestingModule({
      controllers: [MockController],
    }).compile();
    controllerInstance = moduleRef.get(MockController);
    proto = Object.getPrototypeOf(controllerInstance);
  });

  it('IncludeRoles should set metadata on a controller method', () => {
    const direct = Reflect.getMetadata(INCLUDE_ROLES_KEY, proto.include);
    const onProto = Reflect.getMetadata(INCLUDE_ROLES_KEY, proto, 'include');
    expect(direct || onProto).toEqual([Role.Admin, Role.Organizer]);
  });

  it('ExcludeRoles should set metadata on a controller method', () => {
    const direct = Reflect.getMetadata(EXCLUDE_ROLES_KEY, proto.exclude);
    const onProto = Reflect.getMetadata(EXCLUDE_ROLES_KEY, proto, 'exclude');
    expect(direct || onProto).toEqual([Role.Attendee]);
  });
});

describe('RolesGuard logic', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function createContext(user: any, handler: any, includeRoles?: any[], excludeRoles?: any[]) {
    const context = {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => handler,
      getClass: () => ({}),
    } as unknown as ExecutionContext;
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === 'includeRoles') return includeRoles;
      if (key === 'excludeRoles') return excludeRoles;
      return undefined;
    });
    return context;
  }

  it('should throw ForbiddenException if user does not have required include role', () => {
    const user = { roles: [Role.Attendee] };
    const context = createContext(user, () => {}, [Role.Admin], undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user has excluded role', () => {
    const user = { roles: [Role.Admin] };
    const context = createContext(user, () => {}, undefined, [Role.Admin]);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access if user has required include role', () => {
    const user = { roles: [Role.Admin] };
    const context = createContext(user, () => {}, [Role.Admin], undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user does not have excluded role', () => {
    const user = { roles: [Role.Attendee] };
    const context = createContext(user, () => {}, undefined, [Role.Admin]);
    expect(guard.canActivate(context)).toBe(true);
  });
});
