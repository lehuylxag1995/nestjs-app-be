import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//Tạo kho theo sản phẩm và biến thể.
export async function createInventoryByProductAndVariants() {
  const productVariants = await prisma.productVariant.findMany();

  const data: Prisma.InventoryCreateManyInput[] = productVariants.map(
    (variant) => ({
      averageCostPrice: 0,
      quantityAvaliable: 0,
      quantityOnHand: 0,
      quantityReserved: 0,
      totalCostValue: 0,
      maxStock: 1000,
      minStock: 10,
      productId: variant.productId,
      variantId: variant.id,
      note: 'Khởi tạo hệ thống lần đầu',
    }),
  );

  await prisma.inventory.createMany({
    data,
  });
}

// Cập nhật theo type là import, chỉ update 4 cột:
// quantityOnHand,quantityAvaliable,averageCostPrice,totalCostValue
export async function updateInventoryByImport() {
  prisma.$transaction(async (prisma) => {
    // Lấy tồn kho hiện tại
    const inventories = await prisma.inventory.findMany({
      select: {
        variantId: true,
        quantityOnHand: true,
        quantityReserved: true,
        averageCostPrice: true,
      },
    });

    // Lấy tổng số lượng và tổng giá trị nhập theo variantId (chỉ type IMPORT)
    const inventoryTransactions = await prisma.inventoryTransaction.groupBy({
      by: ['variantId'],
      _sum: {
        quantity: true,
        totalCostNotTax: true, // tổng giá trị nhập (quantity * unitCost)
      },
      where: {
        type: 'IMPORT',
      },
    });

    // Cập nhật lại tồn kho và giá vốn (bình quân gia quyền)
    for (const it of inventoryTransactions) {
      const oldData = inventories.find((inv) => inv.variantId === it.variantId);
      if (!oldData) continue;

      const oldQty = Number(oldData.quantityOnHand) || 0;
      const oldCost = Number(oldData.averageCostPrice) || 0;

      const importQty = Number(it._sum.quantity) || 0;
      const importTotalCostNotTax = Number(it._sum.totalCostNotTax) || 0;
      if (importQty <= 0) continue;

      const newQty = oldQty + importQty;
      const newAvgCost =
        newQty > 0
          ? (oldQty * oldCost + importTotalCostNotTax) / newQty
          : oldCost;

      await prisma.inventory.update({
        where: { variantId: it.variantId },
        data: {
          quantityOnHand: newQty,
          quantityAvaliable: newQty - Number(oldData.quantityReserved),
          averageCostPrice: Number(newAvgCost),
          totalCostValue: Number(newAvgCost) * newQty,
        },
      });
    }
  });
}
