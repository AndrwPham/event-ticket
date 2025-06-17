import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        content: dto.content,
        attendee: { connect: { id: dto.userId } },
        event: { connect: { id: dto.eventId } },
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: { attendee: true, event: true },
    });
  }

  findByEvent(eventId: string) {
    return this.prisma.review.findMany({
      where: { eventId },
      include: { attendee: true },
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
