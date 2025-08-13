import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// //Tạo chi tiết đơn nhập hàng
export async function createPurcharsOrderItemsByPurcharsOrder(
  minProduct: number,
  maxProduct: number,
) {
  //Lấy danh sách đơn nhập hàng
  const purcharsOrders = await prisma.purcharsOrder.findMany({
    select: { id: true, status: true },
  });

  //Lấy danh sách products
  const products = await prisma.product.findMany({
    select: {
      id: true,
    },
  });

  // Tạo chi tiết đơn hàng theo đơn hàng
  for (let purcharsOrder of purcharsOrders) {
    // Random sản phẩm trong đơn
    const getNumberProduct = fakerVI.number.int({
      min: minProduct,
      max: maxProduct,
    });
    const productsInOrderItem = fakerVI.helpers.arrayElements(
      products,
      getNumberProduct,
    );

    for (const product of productsInOrderItem) {
      const variants = await prisma.productVariant.findMany({
        where: { productId: product.id },
        select: { id: true },
      });

      // Random số lượng đang có thuộc sản phẩm
      const variantsInOrder = fakerVI.helpers.arrayElements(
        variants,
        fakerVI.number.int({ min: 1, max: variants.length }),
      );

      // Thêm từng variant vào đơn hàng
      for (const variant of variantsInOrder) {
        const quantity = Number(fakerVI.number.int({ min: 20, max: 100 }));
        const taxRate = Number(fakerVI.number.int({ min: 10, max: 15 }));
        const unitCost = Number(
          fakerVI.commerce.price({ min: 100, max: 500, dec: 3 }),
        );
        const taxAmount = (taxRate / 100) * unitCost;
        const unitCostWithTax = unitCost + taxAmount;
        const totalCostNotTax = 0;
        const totalCostWithTax = 0;

        await prisma.purcharsOrderItem.create({
          data: {
            purcharsOrderId: purcharsOrder.id,
            productId: product.id,
            variantId: variant.id,
            orderQuantity: quantity,
            totalReceivedQuantity: 0, //Thay đổi ở PurscharOrderItemReceipt
            unitCost,
            taxRate,
            taxAmount,
            unitCostWithTax,
            totalCostNotTax,
            totalCostWithTax,
          },
        });
      }
    }
  }
}
