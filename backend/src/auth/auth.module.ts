import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
  }), ConfigModule, PrismaModule, EventEmitterModule.forRoot()],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    ...((process.env.NODE_ENV !== 'test') ? [{
      provide: APP_GUARD,
      useClass: RolesGuard,
    }] : []),
  ],
  exports: [
    JwtModule,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class AuthModule { }
