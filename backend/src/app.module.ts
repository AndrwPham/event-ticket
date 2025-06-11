import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { ImageModule } from './image/image.module';
import { TicketModule } from './issuedticket/issuedticket.module';
import { CategoryModule } from './tag/category.module';
import { OrderModule } from './order/order.module';
import { TicketItemModule } from './claimedticket/claimedticket.module';
import { ReviewModule } from './review/review.module';
import { SharedModule } from './common/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
            isGlobal: true,
        }),
    // PrismaModule,
    // AuthModule,
    // EventModule,
    // ImageModule,
    // TicketModule,
    // CategoryModule,
    // OrderModule,
    // TicketItemModule,
    // ReviewModule,
    // SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
