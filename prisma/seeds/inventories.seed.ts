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

