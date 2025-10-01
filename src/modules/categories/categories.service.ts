import { PaginationCategoryDto } from '@Modules/categories/dto/pagination-category.dto';
import { CategoryConflictException } from '@Modules/categories/exceptions/category-conflict.exception';
import { CategoryNotFoundException } from '@Modules/categories/exceptions/category-notfound.exception';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(data: CreateCategoryDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.category.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new CategoryConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async findAll(req: PaginationCategoryDto, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const { page, pageSize, keyword } = req;

    const where: Prisma.CategoryWhereInput = keyword
      ? {
          name: { contains: keyword, mode: 'insensitive' },
        }
      : {};

    const data = await prisma.category.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = await prisma.category.count({ where });

    return {
      data,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const data = await prisma.category.findUnique({ where: { id } });

    if (!data) throw new CategoryNotFoundException({ field: id });

    return data;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const category = await this.findOne(id, prisma);

      return await prisma.category.update({
        where: { id: category.id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new CategoryConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async removeCategory(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const category = await this.findOne(id, prisma);

      return await prisma.category.delete({ where: { id: category.id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003')
          throw new CategoryConflictException({
            message: 'Xung đột khóa ngoại bảng category',
          });
      } else throw error;
    }
  }
}
