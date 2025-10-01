import { PrismaService } from '@Modules/prisma/prisma.service';
import { ProductConflictException } from '@Modules/products/exceptions/product-conflict.exception';
import { ProductNotFoundException } from '@Modules/products/exceptions/product-notfound.exception';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.product.create({
        data: createProductDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ProductConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async findAllProduct(tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    return await prisma.product.findMany();
  }

  async findOneProduct(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const result = await prisma.product.findUnique({
      where: { id },
    });

    if (!result) throw new ProductNotFoundException({ field: id });
    return result;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const product = await this.findOneProduct(id, prisma);

      return await prisma.product.update({
        where: { id: product.id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ProductConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async removeProduct(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const product = await this.findOneProduct(id, prisma);

      return await prisma.product.delete({ where: { id: product.id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003')
          throw new ProductConflictException({
            message: 'Sản phẩm có liên kết khóa ngoại !',
          });
      }
      throw error;
    }
  }
}
