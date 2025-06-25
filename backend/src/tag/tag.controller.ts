import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch } from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tags')
export class TagController {

    constructor(private readonly tagService: TagService) {}

    @Get()
    findAll() {
        return this.tagService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagService.findOne(id);
    }
}
