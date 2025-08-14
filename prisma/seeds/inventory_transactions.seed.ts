import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo biến động giao dịch phiếu nhập
export async function createInventoryTransactions() {
  //Lấy ra đơn nhập hàng có type là partially_received hoặc received
  const purcharsOrders = await prisma.purcharsOrder.findMany({
    where: {
      OR: [{ status: 'PARTIALLY_RECEIVED' }, { status: 'RECEIVED' }],
    },
    include: {
      PurcharsOrderItems: {
        include: {
          PurchaseOrderItemReceipts: true,
        },
      },
    },
  });

  //Duyệt qua hết các đơn nhập hàng đó
  for (const purcharsOrder of purcharsOrders) {
    for (const purcharsOrderItem of purcharsOrder.PurcharsOrderItems) {
      //Lấy thông tin sản phẩm trong kho đang lưu sản phẩm
      //Theo ID sản phẩm, biến thể của đơn hàng
      const inventory = await prisma.inventory.findFirst({
        where: {
          AND: [
            { productId: purcharsOrderItem.productId },
            { variantId: purcharsOrderItem.variantId },
          ],
        },
        select: { id: true },
      });

      //Trường hợp kho chưa lưu sản phẩm và biến thể thì duyệt sản phẩm kế tiếp trong kho
      if (!inventory) continue;

      for (const receipt of purcharsOrderItem.PurchaseOrderItemReceipts) {
        await prisma.inventoryTransaction.create({
          data: {
            type: 'IMPORT',
            productId: purcharsOrderItem.productId,
            variantId: purcharsOrderItem.variantId,
            userId: purcharsOrder.createdById,
            purcharsOrderId: purcharsOrder.id,
            inventoryId: inventory.id,
            quantity: receipt.receivedQuantity,
            costPrice: purcharsOrderItem.unitCost,
            taxRate: purcharsOrderItem.taxRate,
            taxAmount: purcharsOrderItem.taxAmount,
            costPriceWithTax: purcharsOrderItem.unitCostWithTax,
            //Tính lại cái này
            totalCostNotTax:
              Number(receipt.receivedQuantity) *
              Number(purcharsOrderItem.unitCost),
            totalCostWithTax:
              Number(purcharsOrderItem.unitCostWithTax) *
              Number(receipt.receivedQuantity),
            note: 'Tạo giao dịch theo đơn nhập hàng',
          },
        });
      }
    }
  }
}
