import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Role } from './types/role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  private async hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async compare(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }

  async register(dto: RegisterDto) {
    const { email, username, password } = dto;

    const existingUser = await this.prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already in use');
    }

    const existingInfo = await this.prisma.attendeeInfo.findUnique({ where: { email } });
    if (existingInfo) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await this.hash(password);
    const confirmToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashed,
        roles: { set: [Role.Attendee] },
        confirmed: false,
        confirmToken,
        confirmTokenExpiresAt: expiresAt,
      },
    });

    await this.prisma.attendeeInfo.create({
      data: {
        email,
        user: { connect: { id: user.id } },
      },
    });

    this.logger.debug(`User registered: ${user.username} (${user.id}) with token ${confirmToken}`);
    // TODO: call email service to send confirmation email. api: auth/confirm?token=$confirmToken
    const { ...name } = user;
    return name;
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        confirmToken: token,
        confirmTokenExpiresAt: {
          gt: new Date(),
        },
      },
      include: { attendeeInfo: true },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }

    if (user.pendingEmail) {
      if (!user.attendeeInfo) {
        throw new BadRequestException('Attendee info not found for user');
      }
      await this.prisma.attendeeInfo.update({
        where: { id: user.attendeeInfo.id },
        data: { email: user.pendingEmail },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        confirmed: true,
        confirmToken: null,
        confirmTokenExpiresAt: null,
        pendingEmail: null,
      },
    });

    this.logger.debug(`Email confirmed for user: ${user.username} (${user.id})`);
    return { message: 'Email confirmed successfully' };
  }

  async login(dto: LoginDto) {
    const { credential, password, activeRole } = dto;

    if (!credential) {
      throw new BadRequestException('Credential (username or email) must be provided');
    }

    let user;
    if (credential.includes('@')) {
      const userInfo = await this.prisma.attendeeInfo.findUnique({ where: { email: credential } });
      if (!userInfo || !userInfo.userId) {
        throw new UnauthorizedException('Invalid credentials or email not confirmed');
      }
      user = await this.prisma.user.findUnique({ where: { id: userInfo.userId } });
    } else {
      user = await this.prisma.user.findUnique({ where: { username: credential } });
    }

    if (
      !user ||
      !await this.compare(password, user.password)
    ) {
      throw new UnauthorizedException('Invalid credentials or email not confirmed');
    }

    if (!user.confirmed) {
      throw new UnauthorizedException('Email not confirmed');
    }

    if (!user.roles.includes(activeRole)) {
      throw new UnauthorizedException(`You don't have ${activeRole} role`);
    }

    const tokens = await this.getTokens(user.id, user.roles, activeRole);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await this.hash(tokens.refreshToken),
      },
    });

    return {
      tokens,
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
        activeRole: activeRole,
      },
    };
  }

  async switchRole(userId: string, roles: Role[], dto: SwitchRoleDto) {
    const { activeRole } = dto;

    if (!roles.includes(activeRole)) {
      throw new UnauthorizedException(`You don't have ${activeRole} role`);
    }

    const { accessToken, refreshToken } = await this.getTokens(userId, roles, activeRole);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: await this.hash(refreshToken),
      },
    });

    this.logger.debug(`User ${userId} switched role to ${activeRole}`);
    return { message: `Switched role successfully to ${activeRole}` };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(
    userId: string,
    rt: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }
    if (!(await this.compare(rt, user.refreshToken))) {
      throw new UnauthorizedException();
    }

    const { roles, activeRole } = this.jwtService.decode(rt) as JwtPayload;
    const tokens = await this.getTokens(userId, roles, activeRole);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: await this.hash(tokens.refreshToken) },
    });
    return tokens;
  }

  private async getTokens(
    userId: string,
    roles: Role[],
    activeRole: Role,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, roles, activeRole };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async sendConfirmationEmail(user: any, newEmail?: string) {
    // If newEmail is provided, store it as pendingEmail and send confirmation to that address
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token valid for 60 minutes
    let updateData: any = {
      confirmToken: token,
      confirmTokenExpiresAt: expiresAt,
    };
    if (newEmail) {
      updateData.pendingEmail = newEmail;
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
    // TODO: Actually send the email (use a mailer service)
    this.logger.debug(`Confirmation email sent to ${newEmail || user.attendeeInfo?.email || user.username} with token: ${token}`);
    return updatedUser;
  }
}