import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ClaimedTicketService } from './claimedticket.service';
import { CreateClaimedTicketDto } from './dto/create-claimedticket.dto';

@Controller('claimedticket')
export class ClaimedTicketController {
  constructor(private readonly service: ClaimedTicketService) {}

  @Post()
  create(@Body() dto: CreateClaimedTicketDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.service.findByOrder(orderId);
  }

  @Get('ticket/:ticketId')
  findByTicket(@Param('ticketId') ticketId: string) {
    return this.service.findByTicket(ticketId);
  }
}
