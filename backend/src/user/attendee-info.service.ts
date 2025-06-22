import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAttendeeInfoDto } from './dto/update-attendee-info.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AttendeeInfoService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) { }

    async getByUserId(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { attendeeInfo: true },
        });
        if (!user) throw new NotFoundException('User not found');
        return user.attendeeInfo;
    }

    async updateByUserId(userId: string, dto: UpdateAttendeeInfoDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { attendeeInfo: true },
        });
        if (!user) throw new NotFoundException('User not found');
        if (!user.attendeeInfo) throw new NotFoundException('Attendee info not found');
        const isEmailChanged = dto.email && dto.email !== user.attendeeInfo.email;
        const { email, ...otherFields } = dto;
        let updated;
        try {
            if (Object.keys(otherFields).length > 0) {
                updated = await this.prisma.attendeeInfo.update({
                    where: { id: user.attendeeInfo.id },
                    data: { ...otherFields },
                });
            } else {
                updated = user.attendeeInfo;
            }
            if (isEmailChanged) {
                await this.authService.sendConfirmationEmail(user, dto.email);
            }
            return updated;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email or phone already exists');
            }
            throw error;
        }
    }
}
