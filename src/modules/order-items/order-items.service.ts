import { OrderItemBadRequestException } from '@Modules/order-items/exceptions/orderItem-badrequest.exception';
import { OrderItemConflictException } from '@Modules/order-items/exceptions/orderItem-conflict.exception';
import { OrderItemNotFoundException } from '@Modules/order-items/exceptions/orderItem-notfound.exception';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrderItem(
    data: CreateOrderItemDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      data.totalListedPrice = data.quantity * data.listedPrice;

      return await prisma.orderItem.create({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new OrderItemConflictException({
            field: error.meta?.target as string,
          });
        else if (error.code === 'P2003')
          throw new OrderItemBadRequestException({
            message: `Liên kết ràng buộc: Bảng Orders chưa tạo orderId:${data.orderId}`,
          });
      }
      throw error;
    }
  }

  async findAllOrderItem(tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    return await prisma.orderItem.findMany();
  }

  async findOneOrderItem(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    const data = await prisma.orderItem.findUnique({ where: { id } });
    if (!data) throw new OrderItemNotFoundException({ field: id });
    return data;
  }

  async updateOrderItem(
    id: string,
    data: UpdateOrderItemDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const orderItem = await this.findOneOrderItem(id);

      const quantity = data.quantity ?? orderItem.quantity;
      const listedPrice = data.listedPrice ?? orderItem.listedPrice;

      data.totalListedPrice = quantity * Number(listedPrice);

      return await prisma.orderItem.update({
        where: { id: orderItem.id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new OrderItemConflictException({
            field: error.meta?.target as string,
          });
      }
      throw error;
    }
  }

  async removeOrderItem(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const orderItem = await this.findOneOrderItem(id);

      return await prisma.orderItem.delete({
        where: { id: orderItem.id },
      });
    } catch (error) {
      throw error;
    }
  }
}
