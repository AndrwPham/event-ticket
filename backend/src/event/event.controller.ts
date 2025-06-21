import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEventDto) {
    try {
      return await this.eventService.create(dto);
    } catch (error) {
      this.logger.error(`Failed to create event: ${error.message}`);
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return await this.eventService.findAll();
    } catch (error) {
      this.logger.error(`Failed to fetch events: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    try {
      return await this.eventService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fetch event ${id}: ${error.message}`);
      throw error;
    }
  }

  @Get('tag/:tagId')
  @HttpCode(HttpStatus.OK)
  async findByTag(@Param('tagId') tagId: string) {
    try {
      return await this.eventService.findByTag(tagId);
    } catch (error) {
      this.logger.error(`Failed to fetch events by tag ${tagId}: ${error.message}`);
      throw error;
    }
  }

  @Get('city/:city')
  @HttpCode(HttpStatus.OK)
  async findByCity(@Param('city') city: string) {
    try {
      return await this.eventService.findByCity(city);
    } catch (error) {
      this.logger.error(`Failed to fetch events by city ${city}: ${error.message}`);
      throw error;
    }
  }

  @Get('district/:district')
  @HttpCode(HttpStatus.OK)
  async findByDistrict(@Param('district') district: string) {
    try {
      return await this.eventService.findByDistrict(district);
    } catch (error) {
      this.logger.error(`Failed to fetch events by district ${district}: ${error.message}`);
      throw error;
    }
  }

  @Get('ward/:ward')
  @HttpCode(HttpStatus.OK)
  async findByWard(@Param('ward') ward: string) {
    try {
      return await this.eventService.findByWard(ward);
    } catch (error) {
      this.logger.error(`Failed to fetch events by ward ${ward}: ${error.message}`);
      throw error;
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Update an event' })
  // @ApiParam({ name: 'id', description: 'Event ID', type: String })
  // @ApiResponse({ status: 200, description: 'Event updated successfully.' })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // @ApiResponse({ status: 404, description: 'Event not found.' })
  // @ApiBody({ type: UpdateEventDto })
  // async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
  //   try {
  //     return await this.eventService.update(id, dto);
  //   } catch (error) {
  //     this.logger.error(`Failed to update event ${id}: ${error.message}`);
  //     throw error;
  //   }
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    try {
      await this.eventService.remove(id);
      return;
    } catch (error) {
      this.logger.error(`Failed to delete event ${id}: ${error.message}`);
      throw error;
    }
  }
}