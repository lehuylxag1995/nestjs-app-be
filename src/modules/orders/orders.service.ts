import { CreateOrderDto } from '@Modules/orders/dto/create-order.dto';
import { UpdateOrderDto } from '@Modules/orders/dto/update-order.dto';
import { OrderBadRequestException } from '@Modules/orders/exceptions/order-badrequest.exception';
import { OrderConflictException } from '@Modules/orders/exceptions/order-conflict.exception';
import { OrderNotFoundException } from '@Modules/orders/exceptions/order-notfound.exception';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async createOrder(data: CreateOrderDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.order.create({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new OrderConflictException({
            field: error.meta?.target as string,
          });
        else if (error.code === 'P2003')
          throw new OrderBadRequestException({
            message: `Liên kết ràng buộc: userId không tồn tại !`,
          });
      }
      throw error;
    }
  }

  async findOneOrder(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    const data = await prisma.order.findUnique({ where: { id } });
    if (!data) throw new OrderNotFoundException({ field: id });
    return data;
  }

  async updateOrder(
    id: string,
    data: UpdateOrderDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const order = await this.findOneOrder(id, prisma);

      return await prisma.order.update({
        where: { id: order.id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new OrderConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async deleteOrder(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const order = await this.findOneOrder(id, prisma);

      return await prisma.order.delete({ where: { id: order.id } });
    } catch (error) {
      throw error;
    }
  }

  async findAllOrder(tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.order.findMany();
    } catch (error) {
      throw error;
    }
  }
}
