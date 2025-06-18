import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../types/role.enum';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) throw new Error('JWT_SECRET not set in environment');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  // payload = { sub, roles, activeRole }
  async validate(payload: JwtPayload) {
    const { sub: userId, roles, activeRole } = payload;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        roles: true,
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.roles.includes(activeRole as Role)) {
      throw new UnauthorizedException(`You do not have the ${activeRole} role`);
    }

    return {
      userId: user.id,
      username: user.username,
      roles: user.roles,
      activeRole: activeRole as Role,
    };
  }
}
