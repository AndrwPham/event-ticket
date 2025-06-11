import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards
} from '@nestjs/common';
import { IssuedTicketService } from './issuedticket.service';
import { CreateIssuedTicketDto } from './dto/create-issuedticket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tickets')
export class IssuedTicketController {
  constructor(private readonly ticketService: IssuedTicketService) {}

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

    @Get('event/:id')
    findByEvent(@Param('id') id: string) {
        return this.ticketService.findByEventId(id);
    }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateIssuedTicketDto) {
    return this.ticketService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
