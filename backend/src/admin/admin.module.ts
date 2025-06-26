import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IssuedTicketModule } from '../issuedticket/issuedticket.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminController, IssuedTicketModule],
    providers: [AdminService],
})
export class AdminModule {}