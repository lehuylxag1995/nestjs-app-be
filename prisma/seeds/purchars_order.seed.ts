import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createPurcharOrder() {
  await prisma.$transaction(async (prisma) => {
    //Nhà cung cấp
    const listSupplierId = await prisma.supplier.findMany({
      select: { id: true },
    });

    const roleStaff = await prisma.role.findUnique({
      where: { name: 'CUSTOMER' },
    });
    // Nhân viên tạo
    const listUserId = await prisma.user.findMany({
      select: { id: true },
      where: { roleId: roleStaff?.id },
    });
    //Lấy danh sách products và variants
    const listProductAndVariants = await prisma.product.findMany({
      include: {
        ProductVariants: true,
      },
    });

    //  1./Tạo đơn hàng
    const randomSupplierId = fakerVI.helpers.arrayElement(listSupplierId).id;
    const purcharOrder = await prisma.purcharsOrder.create({
      data: {
        supplierId: randomSupplierId,
        createdById: fakerVI.helpers.arrayElement(listUserId).id,
        orderDate: fakerVI.date.recent({ days: 20 }),
        expectedDeliveryDate: fakerVI.date.soon({ days: 60 }).toISOString(),
        status: 'RECEIVED',
        totalNotTax: 0,
        totalWithTax: 0,
        note: 'Hệ thống tạo demo',
      },
    });

    // 2./Tạo chi tiết đơn hàng
    const chosenProductIds = new Set<string>();
    const chosenVariantIds = new Set<string>();
    const recievedById = fakerVI.helpers.arrayElement(listUserId).id;

    //Lấy ra danh sách ngẫu nhiên sản phẩm
    const randomProducts = fakerVI.helpers.arrayElements(
      listProductAndVariants,
      { min: 1, max: listProductAndVariants.length },
    );
    //Duyệt danh sách sản phẩm vừa lấy để tạo chi tiết đơn hàng
    for (const product of randomProducts) {
      //Bỏ qua nếu sản phẩm đã có trong đơn hàng
      if (chosenProductIds.has(product.id)) continue;
      chosenProductIds.add(product.id);

      //Lấy ngẫu nhiên các biến thể thuộc sản phẩm
      const randomVariants = fakerVI.helpers.arrayElements(
        product.ProductVariants,
        {
          min: 1,
          max: product.ProductVariants.length,
        },
      );
      for (const variant of randomVariants) {
        // bỏ qua nếu đã chọn variant này trong đơn hàng
        if (chosenVariantIds.has(variant.id)) continue;
        chosenVariantIds.add(variant.id);

        const orderQuantity = fakerVI.number.int({ min: 50, max: 100 });
        const unitCost = Number(
          fakerVI.commerce.price({
            min: 200,
            max: 1000,
            dec: 3,
          }),
        );
        const taxRate = fakerVI.number.int({ min: 10, max: 15 });
        const taxAmount = unitCost * (taxRate / 100);
        const unitCostWithTax = taxAmount + unitCost;
        const purcharsOrderItem = await prisma.purcharsOrderItem.create({
          data: {
            purcharsOrderId: purcharOrder.id,
            productId: product.id,
            variantId: variant.id,
            orderQuantity,
            unitCost,
            taxRate,
            taxAmount,
            unitCostWithTax,
            totalReceivedQuantity: 0, //Thay đổi ở PurscharOrderItemReceipt
            totalCostNotTax: 0, //Thay đổi ở PurscharOrderItemReceipt
            totalCostWithTax: 0, //Thay đổi ở PurscharOrderItemReceipt
          },
        });

        // 3./Tạo biên nhận theo chi tiết đơn hàng
        // 3.1/Trường hợp là PurcharsOrder = RECEIVED

        await prisma.purchaseOrderItemReceipt.create({
          data: {
            purcharsOrderItemId: purcharsOrderItem.id,
            receivedById: recievedById,
            receivedQuantity: Number(purcharsOrderItem.orderQuantity),
            note: `Tạo theo chi tiết đơn hàng: ${purcharsOrderItem.id}`,
          },
        });

        // 4/Tính toán lại PurcharsOrderItem và PurcharOrder
        // 4.1/Cập nhật số lượng và giá của PurcharsOrderItem
        const agg_quantityReceipt =
          await prisma.purchaseOrderItemReceipt.aggregate({
            where: {
              purcharsOrderItemId: purcharsOrderItem.id,
            },
            _sum: {
              receivedQuantity: true,
            },
          });

        const totalReceivedQuantity = Number(
          agg_quantityReceipt._sum.receivedQuantity ?? 0,
        );
        const totalCostNotTax =
          totalReceivedQuantity * Number(purcharsOrderItem.unitCost);
        const totalCostWithTax =
          totalReceivedQuantity * Number(purcharsOrderItem.unitCostWithTax);
        await prisma.purcharsOrderItem.update({
          where: {
            id: purcharsOrderItem.id,
          },
          data: {
            totalReceivedQuantity,
            totalCostNotTax,
            totalCostWithTax,
          },
        });

        // 4.2/Cập nhật tổng bill của PurcharsOrder
        const agg_PurcharOrderItem = await prisma.purcharsOrderItem.aggregate({
          where: { purcharsOrderId: purcharOrder.id },
          _sum: {
            totalCostNotTax: true,
            totalCostWithTax: true,
          },
        });
        await prisma.purcharsOrder.update({
          where: { id: purcharOrder.id },
          data: {
            totalNotTax: agg_PurcharOrderItem._sum.totalCostNotTax ?? 0,
            totalWithTax: agg_PurcharOrderItem._sum.totalCostWithTax ?? 0,
          },
        });
      }
    }
  });
}
