import { Headers, Body, Controller, Get, Post, UseGuards, Logger, Query, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserWithRoles } from './types/request-with-user.interface';
import { SwitchRoleDto } from './dto/switch-role.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('switch-role')
  switchRole(
    @GetUser() user: UserWithRoles,
    @Body() dto: SwitchRoleDto,
  ) {
    return this.authService.switchRole(user.userId, user.roles, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@GetUser() user: UserWithRoles) {
    return this.authService.logout(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser() user: UserWithRoles) {
    return this.authService.getCurrentUser(user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(
    @GetUser('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const rawRefreshToken = authHeader.split(' ')[1];
    return this.authService.refreshTokens(userId, rawRefreshToken);
  }
}
