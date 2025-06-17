import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';
import { PrismaService } from '../../prisma/prisma.service';

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

  async validate(payload: JwtPayload) {
    const { sub, role } = payload;

    let user;
    if (role === 'Attendee') {
      user = await this.prisma.attendee.findUnique({ where: { id: sub } });
    } else if (role === 'Organizer') {
      user = await this.prisma.organizer.findUnique({ where: { id: sub } });
    } else {
      throw new UnauthorizedException('Invalid role');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      username: user.username,
      role,
    };
  } 
}
