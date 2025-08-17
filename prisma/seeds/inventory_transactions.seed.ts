import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo biến động giao dịch phiếu nhập (nhập hàng)
export async function createInventoryTransactionsByPurcharsOrder() {
  await prisma.$transaction(async (prisma) => {
    // Danh sách phiếu nhập hàng mới tạo mà chưa xử lý
    const ReceiptItems = await prisma.purchaseOrderItemReceipt.findMany({
      where: { isProcessTransaction: false },
      include: {
        PurcharsOrderItem: {
          include: {
            PurcharOrder: true,
          },
        },
      },
    });

    // Duyệt qua hết các đơn nhập hàng đó
    for (const receipt of ReceiptItems) {
      //Lấy thông tin sản phẩm trong kho đang lưu sản phẩm
      //Theo ID sản phẩm, biến thể của đơn hàng
      const inventory = await prisma.inventory.findFirst({
        where: {
          AND: [
            { productId: receipt.PurcharsOrderItem.productId },
            { variantId: receipt.PurcharsOrderItem.variantId },
          ],
        },
      });

      //Trường hợp kho chưa lưu sản phẩm và biến thể thì bỏ qua
      if (!inventory) continue;

      //1./ Tạo giao dịch kho
      await prisma.inventoryTransaction.create({
        data: {
          type: 'IMPORT',
          productId: receipt.PurcharsOrderItem.productId,
          variantId: receipt.PurcharsOrderItem.variantId,
          userId: receipt.PurcharsOrderItem.PurcharOrder.createdById,
          purcharsOrderId: receipt.PurcharsOrderItem.PurcharOrder.id,
          purcharsOrderItemRecieptId: receipt.id,
          inventoryId: inventory.id,
          quantity: receipt.receivedQuantity,
          costPrice: receipt.PurcharsOrderItem.unitCost,
          taxRate: receipt.PurcharsOrderItem.taxRate,
          taxAmount: receipt.PurcharsOrderItem.taxAmount,
          costPriceWithTax: receipt.PurcharsOrderItem.unitCostWithTax,
          //Tính lại cái này
          totalCostNotTax:
            Number(receipt.receivedQuantity) *
            Number(receipt.PurcharsOrderItem.unitCost),
          totalCostWithTax:
            Number(receipt.PurcharsOrderItem.unitCostWithTax) *
            Number(receipt.receivedQuantity),
          note: `Tạo giao dịch theo đơn nhập hàng ${receipt.PurcharsOrderItem.PurcharOrder.id}`,
        },
      });

      //2./ Cập nhật lại tình trang đơn
      await prisma.purchaseOrderItemReceipt.update({
        where: { id: receipt.id },
        data: { isProcessTransaction: true },
      });

      //3./ Cập nhật kho theo giao dịch kho

      //3.1/ Lấy tổng số lượng và tổng giá trị nhập theo đơn hàng vừa tạo
      const agg_transaction = await prisma.inventoryTransaction.aggregate({
        where: {
          purcharsOrderId: receipt.PurcharsOrderItem.PurcharOrder.id,
          variantId: receipt.PurcharsOrderItem.variantId,
        },
        _sum: {
          quantity: true,
          totalCostNotTax: true,
        },
      });

      const oldQuantity = Number(inventory.quantityOnHand);
      const oldTotalValue = Number(inventory.totalCostValue);

      const receivedQuantity = Number(agg_transaction._sum.quantity) ?? 0;
      const receivedValue = Number(agg_transaction._sum.totalCostNotTax) ?? 0;

      const newQuantity = oldQuantity + receivedQuantity;
      const newTotalValue = oldTotalValue + receivedValue;
      const newAvgCost = newTotalValue / newQuantity;

      //3.2/ Cập nhật số lượng, bình quân gia quyền
      await prisma.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          quantityOnHand: newQuantity,
          quantityAvaliable: newQuantity,
          averageCostPrice: newAvgCost,
          totalCostValue: newTotalValue,
          note: `Cập nhật theo số lượng + giá bình quân gia quyền theo của đơn nhập: ${receipt.PurcharsOrderItem.PurcharOrder.id} `,
        },
      });

      //4./ Cập nhật giá niêm yết cho sản phẩm
      let margin = 20;
      const pricingRule = await prisma.pricingRule.findFirst({
        where: {
          categoryId: null,
          customerId: null,
          productVariantId: null,
        },
        select: {
          margin: true,
        },
      });

      if (pricingRule) margin = Number(pricingRule.margin);

      await prisma.productVariant.update({
        where: { id: receipt.PurcharsOrderItem.variantId },
        data: {
          listedPrice: newAvgCost * (margin / 100 + 1),
        },
      });
    }
  });
}
