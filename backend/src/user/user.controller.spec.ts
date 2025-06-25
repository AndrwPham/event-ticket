import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AttendeeInfoService } from './attendee-info.service';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

const mockAttendeeInfoService = {
  getByUserId: jest.fn(),
  updateByUserId: jest.fn(),
};
const mockUserService = {
  getById: jest.fn(),
  updateById: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  let attendeeInfoService: typeof mockAttendeeInfoService;
  let userService: typeof mockUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: AttendeeInfoService, useValue: mockAttendeeInfoService },
        { provide: UserService, useValue: mockUserService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (ctx: ExecutionContext) => true })
      .compile();
    controller = module.get(UserController);
    attendeeInfoService = module.get(AttendeeInfoService);
    userService = module.get(UserService);
    jest.clearAllMocks();
  });

  const req = { user: { id: 'u1' } };

  it('getMe returns user and attendeeInfo', async () => {
    userService.getById.mockResolvedValue({ id: 'u1', username: 'test' });
    attendeeInfoService.getByUserId.mockResolvedValue({ id: 'a1', email: 'mail@mail.com' });
    const result = await controller.getMe(req);
    expect(result).toEqual({ user: { id: 'u1', username: 'test' }, attendeeInfo: { id: 'a1', email: 'mail@mail.com' } });
  });

  it('updateMe calls userService.updateById', async () => {
    userService.updateById.mockResolvedValue({ id: 'u1', username: 'new' });
    const dto: any = { username: 'new' };
    const result = await controller.updateMe(req, dto);
    expect(userService.updateById).toHaveBeenCalledWith('u1', dto);
    expect(result).toEqual({ id: 'u1', username: 'new' });
  });

  it('getAttendeeInfo returns attendeeInfo', async () => {
    attendeeInfoService.getByUserId.mockResolvedValue({ id: 'a1', email: 'mail@mail.com' });
    const result = await controller.getAttendeeInfo(req);
    expect(attendeeInfoService.getByUserId).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ id: 'a1', email: 'mail@mail.com' });
  });

  it('updateAttendeeInfo calls attendeeInfoService.updateByUserId', async () => {
    attendeeInfoService.updateByUserId.mockResolvedValue({ id: 'a1', first_name: 'New' });
    const dto = { first_name: 'New' };
    const result = await controller.updateAttendeeInfo(req, dto);
    expect(attendeeInfoService.updateByUserId).toHaveBeenCalledWith('u1', dto);
    expect(result).toEqual({ id: 'a1', first_name: 'New' });
  });
});
