import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TicketItemService } from './claimedticket.service';
import { CreateTicketItemDto } from './dto/create-claimeditem..dto';

@Controller('ticket-items')
export class TicketItemController {
  constructor(private readonly service: TicketItemService) {}

  @Post()
  create(@Body() dto: CreateTicketItemDto) {
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
