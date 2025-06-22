import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { AttendeeInfoService } from './attendee-info.service';
import { UserService } from './user.service';
import { UpdateAttendeeInfoDto } from './dto/update-attendee-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly attendeeInfoService: AttendeeInfoService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.id;
    const user = await this.userService.getById(userId);
    const attendeeInfo = await this.attendeeInfoService.getByUserId(userId);
    return { user, attendeeInfo };
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.updateById(userId, dto);
  }

  @Get('attendee')
  async getAttendeeInfo(@Req() req) {
    const userId = req.user.id;
    return this.attendeeInfoService.getByUserId(userId);
  }

  @Patch('attendee')
  async updateAttendeeInfo(@Req() req, @Body() dto: UpdateAttendeeInfoDto) {
    const userId = req.user.id;
    return this.attendeeInfoService.updateByUserId(userId, dto);
  }
}
