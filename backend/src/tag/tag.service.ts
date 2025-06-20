import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTagDto) {
    return this.prisma.tag.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.tag.findMany({
      include: {
        events: true, // Include all events of this category
      },
    });
  }

  findOne(id: string) {
    return this.prisma.tag.findUnique({
      where: { id },
      include: { events: true },
    });
  }

    update(id: string, dto: CreateTagDto) {
        return this.prisma.tag.update({
        where: { id },
        data: dto,
        });
    }


  remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
