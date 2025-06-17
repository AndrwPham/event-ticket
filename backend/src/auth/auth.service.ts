import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  async compare(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }

  async register(dto) {
    try {
      const { role, username, password } = dto;
      if (!['Attendee', 'Organizer'].includes(role)) {
        throw new UnauthorizedException('Invalid role provided');
      }

      let existingUser = await this.prisma.attendee.findUnique({ where: { username } });
      if (existingUser) {
        throw new UnauthorizedException('Username is already taken');
      }

      existingUser = await this.prisma.organizer.findUnique({ where: { username } });
      if (existingUser) {
        throw new UnauthorizedException('Username is already taken');
      }

      const hashedPassword = await this.hash(password);

      let user;
      if (role === 'Attendee') {
        user = await this.prisma.attendee.create({
          data: { ...dto, password: hashedPassword },
        });
      } else if (role === 'Organizer') {
        user = await this.prisma.organizer.create({
          data: { ...dto, password: hashedPassword },
        });
      }
      if (!user) {
        throw new UnauthorizedException('Failed to create user');
      }

      return `Account created successfully`;
    } catch (error) {
      console.error("Error in register:", error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Registration failed. Please check your input.');
    }
  }

  async login(username: string, password: string) {
    let user = await this.prisma.attendee.findUnique({ where: { username } });
    let role = 'Attendee';

    if (!user) {
      user = await this.prisma.organizer.findUnique({ where: { username } });
      role = 'Organizer';
    }

    if (!user || !(await this.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, role);
    await this.updateRefreshToken(role, user.id, tokens.refreshToken);
    await this.updateAccessToken(role, user.id, tokens.accessToken);
    return {
      tokens,
      user: {
        id: user.id,
        username: user.username,
        role,
      },
    };
  }

  async logout(role: string, userId: string) {
    if (role === 'Attendee') {
      await this.prisma.attendee.update({
        where: { id: userId },
        data: {
          refreshToken: null,
          accessToken: null,
        },
      });
    } else if (role === 'Organizer') {
      await this.prisma.organizer.update({
        where: { id: userId },
        data: {
          refreshToken: null,
          accessToken: null,
        },
      });
    } else {
      throw new UnauthorizedException('Invalid role');
    }
  }

  async refreshTokens(role: string, userId: string, rt: string) {
    let user;
    if (role === 'Attendee') {
      user = await this.prisma.attendee.findUnique({ where: { id: userId } });
    } else if (role === 'Organizer') {
      user = await this.prisma.organizer.findUnique({ where: { id: userId } });
    } else {
      throw new UnauthorizedException('Invalid role');
    }

    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const rtMatches = await this.compare(rt, user.refreshToken);
    if (!rtMatches) throw new UnauthorizedException();

    const tokens = await this.getTokens(user.id, role);
    await this.updateRefreshToken(role, user.id, tokens.refreshToken);
    await this.updateAccessToken(role, user.id, tokens.accessToken);
    return tokens;
  }

  async updateRefreshToken(role: string, userId: string, refreshToken: string) {
    const hashed = await this.hash(refreshToken);
    if (role === 'Attendee') {
      await this.prisma.attendee.update({
        where: { id: userId },
        data: { refreshToken: hashed },
      });
    } else if (role === 'Organizer') {
      await this.prisma.organizer.update({
        where: { id: userId },
        data: { refreshToken: hashed },
      });
    } else {
      throw new UnauthorizedException('Invalid role');
    }
  }

  async updateAccessToken(role: string, userId: string, accessToken: string) {
    const hashed = await this.hash(accessToken);
    if (role === 'Attendee') {
      await this.prisma.attendee.update({
        where: { id: userId },
        data: { accessToken: hashed },
      });
    } else if (role === 'Organizer') {
      await this.prisma.organizer.update({
        where: { id: userId },
        data: { accessToken: hashed },
      });
    } else {
      throw new UnauthorizedException('Invalid role');
    }
  }

  async getTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async getCurrentUser(role: string, userId: string) {
    let user;
    if (role === 'Attendee') {
      user = await this.prisma.attendee.findUnique({ where: { id: userId } });
    } else if (role === 'Organizer') {
      user = await this.prisma.organizer.findUnique({ where: { id: userId } });
    } else {
      throw new UnauthorizedException('Invalid role');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}