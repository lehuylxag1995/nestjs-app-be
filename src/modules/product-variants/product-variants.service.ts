import { PrismaService } from '@Modules/prisma/prisma.service';
import { ProductVariantConflictException } from '@Modules/product-variants/exceptions/productVariant-conflict.exception';
import { ProductVariantNotFoundException } from '@Modules/product-variants/exceptions/productVariant-notfound.exception';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProductVariant(
    data: CreateProductVariantDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.productVariant.create({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ProductVariantConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async findOneProductVariant(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const data = await prisma.productVariant.findUnique({
      where: { id },
    });

    if (!data) throw new ProductVariantNotFoundException({ field: id });

    return data;
  }

  async updateProductVariant(
    id: string,
    data: UpdateProductVariantDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const productVariant = await this.findOneProductVariant(id, prisma);

      return await prisma.productVariant.update({
        where: { id: productVariant.id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ProductVariantConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async removeProductVariant(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const productVariant = await this.findOneProductVariant(id, prisma);

      return await prisma.productVariant.delete({
        where: { id: productVariant.id },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllProductVariant(tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    return await prisma.productVariant.findMany();
  }
}
