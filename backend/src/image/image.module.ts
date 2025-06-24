import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [JwtModule.register({}),AuthModule, PrismaModule],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService]
})
export class ImageModule {}
