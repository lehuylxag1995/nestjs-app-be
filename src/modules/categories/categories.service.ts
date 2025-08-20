import { CategoryRepository } from '@modules/categories/categories.repository';
import { PaginationCategoryDto } from '@modules/categories/dto/pagination-category.dto';
import { PrismaService } from '@modules/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async isCategoryNameAvailable(name: string) {
    const category = await this.categoryRepository.findCategory({ name });
    return !category; // true = available, false = duplicate
  }

  async create(req: CreateCategoryDto): Promise<Category> {
    const isAvailable = await this.isCategoryNameAvailable(req.name);

    if (!isAvailable) throw new BadRequestException('Tên danh mục đã tồn tại');

    return await this.categoryRepository.create(req);
  }

  async findAll(req: PaginationCategoryDto) {
    const { page, pageSize, keyword } = req;

    const where: Prisma.CategoryWhereInput = keyword
      ? {
          name: { contains: keyword, mode: 'insensitive' },
        }
      : {};

    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where }),
    ]);

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

  async findOne(id: string): Promise<Category> {
    const data = await this.categoryRepository.findCategory({ id });

    if (!data) throw new NotFoundException('Không tìm thấy danh mục');

    return data;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // 1./ Check Id có tồn tại không ?
    await this.findOne(id);

    // 2./ Check parentId có tồn tại không ?
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findCategory({
        id: updateCategoryDto.parentId,
      });

      if (!parentCategory) {
        throw new BadRequestException('Danh mục cha không tồn tại');
      }
    }

    // 3./ Check không trùng tên danh mục
    if (updateCategoryDto.name) {
      const category = await this.categoryRepository.findCategory({
        name: updateCategoryDto.name,
      });
      if (category && category.id !== id)
        throw new BadRequestException('Tên danh mục đã tồn tại');
    }

    // 4./ Check parentId không được là chính nó
    if (updateCategoryDto.parentId && updateCategoryDto.parentId === id)
      throw new BadRequestException('Danh mục không thể là cha của chính nó');

    return await this.categoryRepository.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string): Promise<Category> {
    await this.findOne(id);

    return await this.categoryRepository.delete({ id });
  }

  async changePublished(id: string, published: boolean): Promise<Category> {
    await this.findOne(id);

    return await this.categoryRepository.update({
      where: { id },
      data: {
        published,
      },
    });
  }
}
