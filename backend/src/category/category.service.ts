import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        events: true, // Include all events of this category
      },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { events: true },
    });
  }

    update(id: string, dto: CreateCategoryDto) {
        return this.prisma.category.update({
        where: { id },
        data: dto,
        });
    }


  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
