import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { VenueService } from './venue.service';

@Controller('venues')
export class VenueController {
    constructor(private readonly venueService: VenueService) {}

    @Get()
    async findAll() {
        try {
            return await this.venueService.findAll();
        } catch (error) {
            throw new HttpException(
                'Failed to fetch venues',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
