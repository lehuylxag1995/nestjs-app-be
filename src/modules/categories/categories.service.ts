import { PrismaService } from '@modules/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async checkNameUnique(name: string) {
    const data = await this.prismaService.category.findUnique({
      where: { name },
    });
    if (data) return false;
    return true;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const resultNameUnique = await this.checkNameUnique(createCategoryDto.name);

    if (!resultNameUnique)
      throw new BadRequestException('Tên danh mục đã tồn tại');

    return await this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.prismaService.category.findMany();
  }

  async findOne(id: string) {
    const data = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });

    if (!data) throw new NotFoundException('Không tìm thấy danh mục');

    return data;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.name) {
      const resultNameUnique = await this.checkNameUnique(
        updateCategoryDto.name,
      );
      if (resultNameUnique == false)
        throw new BadRequestException('Tên danh mục đã tồn tại');
    }

    return await this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.category.delete({
      where: { id },
    });
  }

  async changePublished(id: string, published: boolean) {
    await this.findOne(id);

    return await this.prismaService.category.update({
      where: { id },
      data: {
        published,
      },
    });
  }
}
