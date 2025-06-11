import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards
} from '@nestjs/common';
import { TicketService } from './issuedticket.service';
import { CreateTicketDto } from './dto/create-issuedticket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketService.create(dto);
  }

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
  update(@Param('id') id: string, @Body() dto: CreateTicketDto) {
    return this.ticketService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
