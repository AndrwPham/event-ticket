import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { ImageModule } from './image/image.module';
import { TicketModule } from './ticket/ticket.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { TicketItemModule } from './ticket-item/ticket-item.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    EventModule,
    ImageModule,
    TicketModule,
    CategoryModule,
    OrderModule,
    TicketItemModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
