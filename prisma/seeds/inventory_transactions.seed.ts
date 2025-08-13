import { PrismaClient, TransactionType } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo biến động giao dịch phiếu nhập
export async function createInventoryTransactions(type: TransactionType) {
  // Với type=IMPORT thì dựa theo hóa đơn nhập hàng để lấy thông tin
  if (type === 'IMPORT') {
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

    //Duyệt qua hết các status đó để thêm vào giao dịch kho
    for (const purcharsOrder of purcharsOrders) {
      for (const purcharsOrderItem of purcharsOrder.PurcharsOrderItems) {
        //Lấy ID kho
        const inventory = await prisma.inventory.findFirst({
          where: {
            AND: [
              { productId: purcharsOrderItem.productId },
              { variantId: purcharsOrderItem.variantId },
            ],
          },
          select: { id: true },
        });

        if (!inventory) continue; // chưa có inventory thì bỏ qua
        //
        for (const receipt of purcharsOrderItem.PurchaseOrderItemReceipts) {
          await prisma.inventoryTransaction.create({
            data: {
              type,
              productId: purcharsOrderItem.productId,
              variantId: purcharsOrderItem.variantId,
              userId: purcharsOrder.createdById,
              purcharsOrderId: purcharsOrder.id,
              inventoryId: inventory.id,
              quantity: receipt.receivedQuantity,
              costPrice: purcharsOrderItem.unitCost,
              note: 'Hệ thống khởi tạo lần đầu tiên',
            },
          });
        }
      }
    }
  }
}
