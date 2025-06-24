import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateImageDto) {
        return this.imageService.create(dto);
    }

//     @Get()
//     findAll() {
//         return this.imageService.findAll();
//     }
//
//     @Get(':id')
//     findOne(@Param('id') id: string) {
//         return this.imageService.findOne(id);
//     }
//
//     @Get('images/:userId')
//     findByUserId(@Param('userId') userId: string) {
//         return this.imageService.findByUserId(userId);
//     }
//
//     @Get('images/:userId/:type')
//     findByUserIdAndType(
//         @Param('userId') userId: string,
//         @Param('type') type: string,
//     ) {
//         return this.imageService.findByUserIdAndType(userId, type);
//     }
//
//     @Get('images/:eventId')
//     findByEventId(@Param('eventId') eventId: string) {
//         return this.imageService.findByEventId(eventId);
//     }
//
//     @Get('images/:eventId/:type') 
//     findByEventIdAndType(
//         @Param('eventId') eventId: string,
//         @Param('type') type: string,
//     ) {
//         return this.imageService.findByEventIdAndType(eventId, type);
//     }
//
//     @Get('images/:ticket')
//     findByTicketId(@Param('ticket') ticket: string) {
//         return this.imageService.findByTicketId(ticket);
//     }
//
//     @Get('images/:ticket/:type')
//     findByTicketIdAndType(
//         @Param('ticket') ticket: string,
//         @Param('type') type: string,
//     ) {
//         return this.imageService.findByTicketIdAndType(ticket, type);
//     }
//
//
//
//     @UseGuards(JwtAuthGuard)
//     @Patch(':id')
//     update(@Param('id') id: string, @Body() dto: CreateImageDto) {
//         return this.imageService.update(id, dto);
//     }
//
//     @UseGuards(JwtAuthGuard)
//     @Delete(':id')
//     remove(@Param('id') id: string) {
//         return this.imageService.remove(id);
//     }
}
