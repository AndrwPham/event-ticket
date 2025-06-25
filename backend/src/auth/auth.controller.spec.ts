import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { Role } from '@prisma/client';

// Mock AuthService methods
const mockAuthService = {
  register: jest.fn(),
  confirmEmail: jest.fn(),
  login: jest.fn(),
  switchRole: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
  refreshTokens: jest.fn(),
};

describe('AuthController (unit)', () => {
  let controller: AuthController;
  let service: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('should call AuthService.register', async () => {
    const dto: RegisterDto = { email: 'a@b.com', username: 'u', password: 'pw' };
    service.register.mockResolvedValue({ message: 'ok' });
    const result = await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'ok' });
  });

  it('should call AuthService.confirmEmail', async () => {
    service.confirmEmail.mockResolvedValue({ message: 'confirmed' });
    const result = await controller.confirm('token123');
    expect(service.confirmEmail).toHaveBeenCalledWith('token123');
    expect(result).toEqual({ message: 'confirmed' });
  });

  it('should call AuthService.login', async () => {
    const dto: LoginDto = { credential: 'u', password: 'pw', activeRole: Role.Attendee };
    service.login.mockResolvedValue({ tokens: {}, user: {} });
    const result = await controller.login(dto, { cookie: jest.fn() });
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ user: {} });
  });

  it('should call AuthService.switchRole', async () => {
    const user = { userId: 'u1', roles: [Role.Attendee, Role.Organizer] };
    const dto: SwitchRoleDto = { activeRole: Role.Organizer };
    service.switchRole.mockResolvedValue({ message: 'Switched' });
    const result = await controller.switchRole(user as any, dto);
    expect(service.switchRole).toHaveBeenCalledWith('u1', [Role.Attendee, Role.Organizer], dto);
    expect(result).toEqual({ message: 'Switched' });
  });

  it('should call AuthService.logout', async () => {
    const user = { userId: 'u1' };
    service.logout.mockResolvedValue(undefined);
    const result = await controller.logout(user as any);
    expect(service.logout).toHaveBeenCalledWith('u1');
    expect(result).toBeUndefined();
  });

  it('should call AuthService.getCurrentUser', async () => {
    const user = { userId: 'u1' };
    service.getCurrentUser.mockResolvedValue({ id: 'u1', username: 'u' });
    const result = await controller.me(user as any);
    expect(service.getCurrentUser).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ id: 'u1', username: 'u' });
  });

  it('should call AuthService.refreshTokens', async () => {
    service.refreshTokens.mockResolvedValue({ accessToken: 'a', refreshToken: 'r' });
    const reqUserId = 'u1';
    const authHeader = 'Bearer sometoken';
    const result = await controller.refresh(reqUserId, authHeader);
    expect(service.refreshTokens).toHaveBeenCalledWith('u1', 'sometoken');
    expect(result).toEqual({ accessToken: 'a', refreshToken: 'r' });
  });
});
