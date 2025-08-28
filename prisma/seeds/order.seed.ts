import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createOrder() {
  await prisma.$transaction(async (prisma) => {
    const roleStaff = await prisma.role.findUnique({
      where: { name: 'CUSTOMER' },
    });
    //Danh sách khách hàng
    const listCustomer = await prisma.user.findMany({
      where: { roleId: roleStaff?.id },
    });

    //Danh sách sản phẩm trong kho khách sẽ lựa
    const listInventories = await prisma.inventory.findMany({
      where: {
        quantityAvaliable: {
          gt: 0,
        },
      },
    });

    //1./ Tạo đơn đặt hàng
    const order = await prisma.order.create({
      data: {
        status: 'SHIPPED',
        total: 0,
        userId: fakerVI.helpers.arrayElement(listCustomer).id,
      },
    });

    //2./ Tạo số lượng chi tiết đơn hàng ngẫu nhiên trong kho
    let choseProductVariantIds = new Set<string>();
    const randomInventories = fakerVI.helpers.arrayElements(
      listInventories,
      fakerVI.number.int({ min: 1, max: 3 }),
    );
    for (const inventory of randomInventories) {
      //Chi tiết đơn hàng không được trùng
      if (choseProductVariantIds.has(inventory.variantId)) continue;
      choseProductVariantIds.add(inventory.variantId);

      const quantity = fakerVI.number.int({ min: 1, max: 5 });
      const listedPrice = Number(inventory.averageCostPrice);
      const totalListedPrice = quantity * listedPrice;
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: inventory.productId,
          variantId: inventory.variantId,
          quantity,
          listedPrice: inventory.averageCostPrice,
          totalListedPrice,
        },
      });
    }

    // 3./ Update tổng order
    const agg_order = await prisma.orderItem.aggregate({
      where: { orderId: order.id },
      _sum: {
        totalListedPrice: true,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        total: agg_order._sum.totalListedPrice ?? 0,
      },
    });
  });
}
