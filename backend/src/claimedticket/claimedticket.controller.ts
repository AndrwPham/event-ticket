import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ClaimedTicketService } from './claimedticket.service';
import { CreateClaimedTicketDto } from './dto/create-claimedticket.dto';
import { BatchCreateClaimedTicketDto } from './dto/batch-create-claimedticket.dto';
import { ClaimedTicketStatus } from './claimedticket-status.enum';

@Controller('claimed-tickets')
export class ClaimedTicketController {
  constructor(private readonly claimedTicketService: ClaimedTicketService) {}

  @Get()
  findAll() {
    return this.claimedTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.claimedTicketService.getByTicket(id);
  }

  @Get('attendee/:attendeeId')
  findByAttendee(@Param('attendeeId') attendeeId: string) {
    return this.claimedTicketService.getByAttendee(attendeeId);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.claimedTicketService.getByOrder(orderId);
  }

  @Post()
  create(@Body() dto: CreateClaimedTicketDto) {
    return this.claimedTicketService.create(dto);
  }

  @Post('batch')
  batchCreate(@Body() dto: BatchCreateClaimedTicketDto) {
    return this.claimedTicketService.createClaimedTickets(
      dto.orderId,
      dto.attendeeId,
      dto.ticketIds,
      dto.status ?? ClaimedTicketStatus.READY,
    );
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: ClaimedTicketStatus }) {
    return this.claimedTicketService.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.claimedTicketService.remove(id);
  }
}
