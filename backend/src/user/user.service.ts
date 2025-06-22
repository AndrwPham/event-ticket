import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getById(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateById(userId: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        let password = dto.password;
        if (!dto.password) {
            throw new ConflictException('Password is required to update');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Username already exists');
            }
            throw error;
        }
    }
}
