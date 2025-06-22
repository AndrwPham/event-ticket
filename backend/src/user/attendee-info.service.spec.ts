import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeInfoService } from './attendee-info.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  attendeeInfo: {
    update: jest.fn(),
  },
};

const mockAuthService = {
  sendConfirmationEmail: jest.fn(),
};

describe('AttendeeInfoService', () => {
  let service: AttendeeInfoService;
  let prisma: typeof mockPrisma;
  let authService: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendeeInfoService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();
    service = module.get(AttendeeInfoService);
    prisma = module.get(PrismaService);
    authService = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe('getByUserId', () => {
    it('returns attendeeInfo if user exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ attendeeInfo: { id: 'a1' } });
      const result = await service.getByUserId('u1');
      expect(result).toEqual({ id: 'a1' });
    });
    it('throws if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getByUserId('u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateByUserId', () => {
    const user = { id: 'u1', attendeeInfo: { id: 'a1', email: 'old@mail.com' } };
    it('updates non-email fields', async () => {
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.attendeeInfo.update.mockResolvedValue({ id: 'a1', first_name: 'New' });
      const dto = { first_name: 'New' };
      const result = await service.updateByUserId('u1', dto);
      expect(prisma.attendeeInfo.update).toHaveBeenCalledWith({ where: { id: 'a1' }, data: { first_name: 'New' } });
      expect(result).toEqual({ id: 'a1', first_name: 'New' });
    });
    it('calls authService.sendConfirmationEmail if email changed', async () => {
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.attendeeInfo.update.mockResolvedValue(user.attendeeInfo);
      const dto = { email: 'new@mail.com' };
      await service.updateByUserId('u1', dto);
      expect(authService.sendConfirmationEmail).toHaveBeenCalledWith(user, 'new@mail.com');
      expect(prisma.attendeeInfo.update).not.toHaveBeenCalled();
    });
    it('throws if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updateByUserId('u1', {})).rejects.toThrow(NotFoundException);
    });
    it('throws if attendeeInfo not found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', attendeeInfo: null });
      await expect(service.updateByUserId('u1', {})).rejects.toThrow(NotFoundException);
    });
    it('throws ConflictException on duplicate', async () => {
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.attendeeInfo.update.mockRejectedValue({ code: 'P2002' });
      const dto = { first_name: 'New' };
      await expect(service.updateByUserId('u1', dto)).rejects.toThrow(ConflictException);
    });
  });
});
