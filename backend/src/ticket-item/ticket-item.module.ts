import { Module } from '@nestjs/common';
import { TicketItemService } from './ticket-item.service';
import { TicketItemController } from './ticket-item.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [JwtModule.register({}), AuthModule, PrismaModule],
  controllers: [TicketItemController],
  providers: [TicketItemService],
  exports: [TicketItemService]
})
export class TicketItemModule {}
