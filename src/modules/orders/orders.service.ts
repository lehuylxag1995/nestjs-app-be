import { CreateOrderItemDto } from '@modules/orders/dto/create-order-item.dto';
import { UpdateOrderItemDto } from '@modules/orders/dto/update-order-item.dto';
import { PrismaService } from '@modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  //Tạo mới đơn hàng và chi tiết đơn hàng
  async createOrder(userId: string, items: CreateOrderItemDto[]) {
    return this.prismaService.$transaction(async (prisma) => {
      //1. Tạo đơn hàng
      const order = await prisma.order.create({
        data: {
          userId,
          total: 0,
        },
      });

      //2. Thêm chi tiết đơn hàng
      let totalBill = 0;
      const data: Prisma.OrderItemCreateManyInput[] = items.map((item) => {
        const total = item.price * item.quantity;
        totalBill += total;
        return {
          orderId: order.id,
          price: item.price,
          quantity: item.quantity,
          total,
          productId: item.productId,
        };
      });
      await prisma.orderItem.createMany({ data });

      //3.Cập nhật lại bill
      await this.updateOrderTotal(prisma, order.id);

      //4. Trả về bill
      return await this.findOrderById(prisma, order.id);
    });
  }

  //Tạo chi tiết đơn hàng
  async createItemToExistingOrder(orderId: string, dto: CreateOrderItemDto) {
    return this.prismaService.$transaction(async (prisma) => {
      //1. Thêm chi tiết đơn hàng
      await prisma.orderItem.create({
        data: {
          orderId,
          productId: dto.productId,
          price: dto.price,
          quantity: dto.quantity,
          total: dto.price * dto.quantity,
        },
      });

      //2.Cập nhật lại bill
      await this.updateOrderTotal(prisma, orderId);

      //3. Trả về bill
      return await this.findOrderById(prisma, orderId);
    });
  }

  //Sửa chi tiết đơn hàng
  async editItemToExistingOrder(
    orderId: string,
    itemId: string,
    dto: UpdateOrderItemDto,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      //Validation dto
      if (dto.price === undefined || dto.quantity === undefined)
        throw new BadRequestException(
          'Bạn chưa nhập giá và số lượng sản phẩm ',
        );

      //Cập nhật lại chi tiết đơn hàng
      await prisma.orderItem.update({
        where: { id: itemId },
        data: {
          orderId,
          price: dto.price,
          quantity: dto.quantity,
          total: dto.price * dto.quantity,
        },
      });

      //Cập nhật lại tổng bill
      await this.updateOrderTotal(prisma, orderId);

      //Trả về thông tin bill
      return await this.findOrderById(prisma, orderId);
    });
  }

  //Xóa đơn hàng
  async remove(id: string) {
    await this.findOne(id);

    await this.prismaService.order.delete({ where: { id } });
  }

  //Xóa chi tiết đơn hàng
  async removeItemToExistingOrder(orderId: string, itemId: string) {
    return this.prismaService.$transaction(async (prisma) => {
      //Kiểm tra tồn tại của chi tiết đơn hàng
      const isOrderItemExist = await prisma.orderItem.findUnique({
        where: {
          id: itemId,
          orderId,
        },
      });
      if (!isOrderItemExist)
        throw new BadRequestException('Không tìm thấy chi tiết đơn hàng !');

      //Xóa chi tiết đơn hàng
      await prisma.orderItem.delete({
        where: {
          id: itemId,
        },
      });

      //Cập nhật lại tổng bill
      await this.updateOrderTotal(prisma, orderId);
    });
  }

  //Tất cả đơn hàng và chi tiết đơn hàng
  async findAll() {
    return await this.prismaService.order.findMany({
      include: { items: true },
    });
  }

  //Tìm kiếm đơn hàng và chi tiết đơn hàng
  async findOne(id: string) {
    const data = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!data) throw new BadRequestException('Không tìm thấy đơn hàng theo Id');
    return data;
  }

  private async updateOrderTotal(
    prisma: Prisma.TransactionClient,
    orderId: string,
  ) {
    const total = await prisma.orderItem.aggregate({
      where: { orderId },
      _sum: {
        total: true,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { total: total._sum.total || 0 },
    });
  }

  private async findOrderById(prisma: Prisma.TransactionClient, id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            quantity: true,
            price: true,
            total: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            address: true,
            phone: true,
          },
        },
      },
      omit: {
        updatedAt: true,
      },
    });
  }
}
