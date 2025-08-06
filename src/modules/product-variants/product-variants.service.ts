import { PrismaService } from '@modules/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkUniqueSku_Size_Color(
    productId: string,
    sku: string,
    size: string,
    color?: string,
  ) {
    const isSkuExits = await this.prismaService.productVariant.findFirst({
      where: {
        productId,
        sku,
      },
    });
    if (isSkuExits)
      throw new BadRequestException('Mã định danh (sku) đã tồn tại !');

    const isColorExits = await this.prismaService.productVariant.findFirst({
      where: {
        productId,
        size,
        color,
      },
    });
    if (isColorExits)
      throw new BadRequestException(
        'Kích thước + màu sắc sản phẩm đã tồn tại !',
      );
  }

  async create(
    productId: string,
    createProductVariantDto: CreateProductVariantDto,
  ) {
    //Check trùng sku,size,color
    await this.checkUniqueSku_Size_Color(
      productId,
      createProductVariantDto.sku,
      createProductVariantDto.size,
      createProductVariantDto.color,
    );

    return await this.prismaService.productVariant.create({
      data: {
        ...createProductVariantDto,
        productId,
      },
    });
  }

  async findOne(id: string) {
    const data = await this.prismaService.productVariant.findUnique({
      where: { id },
    });

    if (!data) throw new BadRequestException('Không tìm thấy biến thể theo Id');

    return data;
  }

  async update(
    productId: string,
    id: string,
    updateProductVariantDto: UpdateProductVariantDto,
  ) {
    //1. Kiểm tra tồn tại
    const existing = await this.prismaService.productVariant.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Biến thể sản phẩm không tồn tại');
    }

    // 2. Check (color + size) đã tồn tại (trừ chính nó)
    const duplicateVariant = await this.prismaService.productVariant.findFirst({
      where: {
        productId,
        color: updateProductVariantDto.color,
        size: updateProductVariantDto.size,
        NOT: { id },
      },
    });
    if (duplicateVariant) {
      throw new BadRequestException('Kích thước + màu sắc đã tồn tại!');
    }

    // 3. Check SKU nếu có thay đổi
    if (
      updateProductVariantDto.sku &&
      updateProductVariantDto.sku !== existing.sku
    ) {
      const isSkuDuplicate = await this.prismaService.productVariant.findFirst({
        where: {
          sku: updateProductVariantDto.sku,
          productId,
          NOT: { id },
        },
      });
      if (isSkuDuplicate) {
        throw new BadRequestException('SKU đã tồn tại');
      }
    }

    // 4. Update
    return await this.prismaService.productVariant.update({
      where: { id },
      data: updateProductVariantDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.productVariant.delete({
      where: { id },
    });
  }
}
