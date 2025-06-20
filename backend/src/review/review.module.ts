import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewService } from './review.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ReviewController } from './review.controller';

@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
