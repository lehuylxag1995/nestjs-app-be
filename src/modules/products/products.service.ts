import { PrismaService } from '@modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async checkNameUnique(name: string) {
    const result = await this.prismaService.product.findUnique({
      where: { name },
    });

    if (!result) return false;

    return true;
  }

  async create(createProductDto: CreateProductDto) {
    //Check trùng tên sản phẩm
    const checkName = await this.checkNameUnique(createProductDto.name);
    if (checkName) throw new BadRequestException('Tên sản phẩm đã tồn tại');

    return await this.prismaService.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return await this.prismaService.product.findMany();
  }

  async findOne(id: string) {
    const result = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!result)
      throw new BadRequestException('Không tìm thấy sản phẩm theo ID');
    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.name) {
      const result = await this.checkNameUnique(updateProductDto.name);
      if (result) throw new BadRequestException('Tên sản phẩm đã tồn tại !');
    }

    return await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prismaService.product.delete({ where: { id } });
  }
}
