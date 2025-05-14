import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
  Logger
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.eventService.findbyCategory(categoryId);
  }

  @Get('city/:cityId')
  findByCity(@Param('cityId') cityId: string) {
    return this.eventService.findbyCity(cityId);
  }

  @Get('district/:districtId')
  findByDistrict(@Param('districtId') districtId: string) {
    return this.eventService.findbyDistrict(districtId);
  }

  @Get('ward/:wardId')
  findByWard(@Param('wardId') wardId: string) {
    return this.eventService.findbyWard(wardId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateEventDto) {
    return this.eventService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
