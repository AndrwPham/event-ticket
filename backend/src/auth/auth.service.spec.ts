// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService }        from './auth.service';
import { PrismaService }      from '../prisma/prisma.service';
import { JwtService }         from '@nestjs/jwt';
import { Role }               from '@prisma/client';
import { ConflictException,
         BadRequestException,
         UnauthorizedException } from '@nestjs/common';
import * as bcrypt            from 'bcryptjs';
import { v4 as uuidv4 }       from 'uuid';

jest.mock('bcryptjs');
jest.mock('uuid');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: Partial<Record<keyof PrismaService, any>>;
  let jwt: Partial<JwtService>;

  beforeEach(async () => {
    // quick mocks for Prisma
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst:  jest.fn(),
        create:     jest.fn(),
        update:     jest.fn(),
      },
      attendeeInfo: {
        findUnique: jest.fn(),
        create:     jest.fn(),
      },
    };

    // quick mocks for JwtService
    jwt = {
      signAsync: jest.fn(),
      decode:    jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService,     useValue: jwt   },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    it('creates a new user + profile on no conflict', async () => {
      // no existing user/email
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.attendeeInfo.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      (uuidv4 as jest.Mock).mockReturnValue('token-123');

      const createdUser = { id: 'u1', username: 'alice' };
      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);
      (prisma.attendeeInfo.create as jest.Mock).mockResolvedValue({ email: 'a@b.com' });

      const result = await service.register({
        email:    'a@b.com',
        username: 'alice',
        password: 'secret',
      });

      expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          username: 'alice',
          password: 'hashed-pw',
          roles:    { set: [Role.Attendee] },
          confirmed: false,
          confirmToken: 'token-123',
        }),
      }));
      expect(prisma.attendeeInfo.create).toHaveBeenCalledWith({
        data: { email: 'a@b.com', user: { connect: { id: 'u1' } } },
      });
      expect(result).toEqual({ id: 'u1', username: 'alice' }); // register returns user object
    });

    it('throws conflict if username taken', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1' });
      await expect(service.register({
        email: 'e@x.com', username: 'bob', password: 'pw'
      })).rejects.toThrow(ConflictException);
    });

    it('throws conflict if email taken', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.attendeeInfo.findUnique as jest.Mock).mockResolvedValue({ id: 'i1' });
      await expect(service.register({
        email: 'e@x.com', username: 'bob', password: 'pw'
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('confirmEmail', () => {
    it('flips confirmed=true on valid token', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'u1' });
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const res = await service.confirmEmail('token-123');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: {
          confirmed: true,
          confirmToken: null,
          confirmTokenExpiresAt: null,
          pendingEmail: null,
        },
      });
      expect(res).toEqual({ message: 'Email confirmed successfully' });
    });

    it('throws if token invalid', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.confirmEmail('bad-token')).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const dto = { credential:'alice', password:'pw', activeRole: Role.Attendee };
    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.signAsync as jest.Mock).mockResolvedValueOnce('access-1').mockResolvedValueOnce('refresh-1');
    });

    it('returns tokens on valid credentials & role', async () => {
      // user exists, confirmed, has Attendee in roles
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id:'u1', username:'alice', password:'pw', confirmed:true, roles:[Role.Attendee]
      });

      const out = await service.login(dto);
      expect(out.tokens).toEqual({ accessToken:'access-1', refreshToken:'refresh-1' });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where:{id:'u1'},
        data:{ refreshToken: expect.any(String) },
      });
      expect(out.user).toMatchObject({ id:'u1', username:'alice', roles:[Role.Attendee], activeRole:Role.Attendee });
    });

    it('throws on bad password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ password:'other', confirmed:true, roles:[Role.Attendee] });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws if not confirmed', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password:'pw', confirmed:false, roles:[Role.Attendee]
      });
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws if role not in user.roles', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        password:'pw', confirmed:true, roles:[Role.Admin]
      });
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens on valid email credential', async () => {
      // Mock attendeeInfo and user lookup
      (prisma.attendeeInfo.findUnique as jest.Mock).mockResolvedValue({ userId: 'u2' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'u2', username: 'bob', password: 'pw', confirmed: true, roles: [Role.Attendee]
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.signAsync as jest.Mock).mockReset();
      (jwt.signAsync as jest.Mock).mockResolvedValueOnce('access-2').mockResolvedValueOnce('refresh-2');
      const dto = { credential: 'bob@example.com', password: 'pw', activeRole: Role.Attendee };
      const out = await service.login(dto);
      expect(out.tokens).toEqual({ accessToken: 'access-2', refreshToken: 'refresh-2' });
      expect(out.user).toMatchObject({ id: 'u2', username: 'bob', roles: [Role.Attendee], activeRole: Role.Attendee });
    });

    it('throws if attendeeInfo not found for email', async () => {
      (prisma.attendeeInfo.findUnique as jest.Mock).mockResolvedValue(null);
      const dto = { credential: 'noone@example.com', password: 'pw', activeRole: Role.Attendee };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws if user not found for attendeeInfo email', async () => {
      (prisma.attendeeInfo.findUnique as jest.Mock).mockResolvedValue({ userId: 'u3' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const dto = { credential: 'ghost@example.com', password: 'pw', activeRole: Role.Attendee };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('switchRole', () => {
    beforeEach(() => {
      (jwt.signAsync as jest.Mock).mockResolvedValueOnce('access-2').mockResolvedValueOnce('refresh-2');
    });

    it('rotates tokens when role permitted', async () => {
      const res = await service.switchRole('u1', [Role.Attendee,Role.Organizer], { activeRole:Role.Organizer });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where:{id:'u1'},
        data:{ refreshToken: expect.any(String) },
      });
      expect(res).toEqual({ message: 'Switched role successfully to Organizer' });
    });

    it('throws if role not permitted', async () => {
      await expect(service.switchRole('u1', [Role.Attendee], { activeRole:Role.Organizer }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.decode as jest.Mock).mockReturnValue({ sub:'u1', roles:[Role.Attendee], activeRole:Role.Attendee });
      (jwt.signAsync as jest.Mock).mockResolvedValueOnce('a3').mockResolvedValueOnce('r3');
    });

    it('issues new tokens on matching refresh', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ refreshToken:'hashed-rt' });
      // compare must return true
      await expect(service.refreshTokens('u1','rt-raw')).resolves.toEqual({ accessToken:'a3', refreshToken:'r3' });
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('throws on missing/invalid token', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.refreshTokens('u1','x')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('clears refreshToken', async () => {
      prisma.user.update = jest.fn().mockResolvedValue(null);
      await service.logout('u1');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where:{id:'u1'}, data:{ refreshToken: null }
      });
    });
  });
});
