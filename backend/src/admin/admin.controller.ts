import { Controller, Get, UseGuards, Patch, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IncludeRoles } from '../auth/decorators/include-roles.decorator';
import { Role } from '../auth/types/role.enum';
import { EventStatus } from '../event/types/event-status.enum';
import { BadRequestException } from '@nestjs/common';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@IncludeRoles(Role.Admin) // Note: Uses 'Admin' from your schema's enum
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('dashboard')
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('events/pending')
    getPendingEvents() {
        return this.adminService.getPendingEvents();
    }

    @Patch('events/:id/validate')
    validateEvent(
        @Param('id') id: string,
        @Body('status') status: EventStatus,
    ) {
        if (status !== EventStatus.APPROVED && status !== EventStatus.REJECTED) {
            throw new BadRequestException('Invalid status. Must be APPROVED or REJECTED.');
        }
        return this.adminService.validateEvent(id, status);
    }
}