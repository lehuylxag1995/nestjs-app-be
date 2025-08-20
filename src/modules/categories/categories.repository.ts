import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.category.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.delete({
      where,
    });
  }

  async findCategory(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({ where });
  }

  async findAll(params: Prisma.CategoryFindManyArgs) {
    return this.prisma.category.findMany(params);
  }

  async count(where: Prisma.CategoryWhereInput) {
    return await this.prisma.category.count({ where });
  }
}
