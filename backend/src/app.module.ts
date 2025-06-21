import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { ImageModule } from './image/image.module';
import { IssuedTicketModule } from './issuedticket/issuedticket.module';
import { TagModule } from './tag/tag.module';
import { OrderModule } from './order/order.module';
import { ClaimedTicketModule } from './claimedticket/claimedticket.module';
import { ReviewModule } from './review/review.module';
import { SharedModule } from './common/shared.module';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    EventModule,
    ImageModule,
    IssuedTicketModule,
    TagModule,
    OrderModule,
    ClaimedTicketModule,
    ReviewModule,
    SharedModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService): RedisModuleOptions => {
        const host = cs.get<string>('REDIS_HOST') || '127.0.0.1';
        const port = cs.get<number>('REDIS_PORT') ?? 6379;
        const url = cs.get<string>('REDIS_URL')
          || `redis://${host}:${port}`;

        return {
          type: 'single',
          url,
        };
      },
      inject: [ConfigService],
    }),
    PaymentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
