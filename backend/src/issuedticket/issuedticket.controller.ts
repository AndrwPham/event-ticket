import {
  Controller, Get, Patch, Param, Delete, UseGuards, Body, Post
} from '@nestjs/common';
import { IssuedTicketService } from './issuedticket.service';
import { UpdateIssuedTicketDto } from './dto/update-issuedticket.dto';
import { GenerateIssuedTicketsDto } from './dto/generate-issued-tickets.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIssuedTicketDto) {
    return this.ticketService.update(id, dto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('generate')
  generateFromSchema(@Body() dto: GenerateIssuedTicketsDto) {
    return this.ticketService.generateTicketsFromSchema(dto);
  }

  @Post('update')
  updateFromSchema(@Body() dto: GenerateIssuedTicketsDto) {
    return this.ticketService.updateTicketsFromSchema(dto);
  }
}
