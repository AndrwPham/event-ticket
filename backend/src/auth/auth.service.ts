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

  async register(email: string, username: string, password: string) {
    const hashed = await this.hash(password);
    const user = await this.prisma.user.create({
      data: { email, username, password: hashed },
    });
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.updateAccessToken(user.id, tokens.accessToken);
    return tokens;
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user || !(await this.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.updateAccessToken(user.id, tokens.accessToken);
    return {
      tokens,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        refreshToken: null, 
        accessToken: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const rtMatches = await this.compare(rt, user.refreshToken);
    if (!rtMatches) throw new UnauthorizedException();

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.updateAccessToken(user.id, tokens.accessToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await this.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async updateAccessToken(userId: string, accessToken: string) {
    const hashed = await this.hash(accessToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { accessToken: hashed },
    });
  }

  async getTokens(userId: string) {
    const payload = { sub: userId };
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

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
