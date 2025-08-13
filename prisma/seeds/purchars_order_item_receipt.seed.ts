import { fakerVI } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo phiếu nhập bổ sung
export async function createPurscharOrderItemReceipt() {
  // Lấy danh sách tài khoản người dùng
  const users = await prisma.user.findMany({
    where: { role: 'STAFF' },
    select: { id: true },
  });

  // Lấy các đơn hàng có status = received or partially_received
  const purcharsOrders = await prisma.purcharsOrder.findMany({
    where: {
      OR: [{ status: 'RECEIVED' }, { status: 'PARTIALLY_RECEIVED' }],
    },
    include: {
      PurcharsOrderItems: {
        include: {
          PurchaseOrderItemReceipts: true,
        },
      },
    },
  });

  for (const purcharsOrder of purcharsOrders) {
    for (const purcharsOrderItem of purcharsOrder.PurcharsOrderItems) {
      // Xét nếu PurcharsOrder status = RECVIED thì receivedQuantity = orderQuantity đó
      if (purcharsOrder.status === 'RECEIVED') {
        const receivedQuantity = Number(purcharsOrderItem.orderQuantity);
        const randomUserId = fakerVI.helpers.arrayElement(users).id;
        await prisma.purchaseOrderItemReceipt.create({
          data: {
            purcharsOrderItemId: purcharsOrderItem.id,
            receivedQuantity,
            receivedById: randomUserId,
            note: 'Nhà cung cấp giao hàng đủ trong lần đầu tiên',
          },
        });
      }
      // Xét nếu PurcharsOrder status = partially_received
      // thì receivedQuantity phải random nhiều lần và cộng tất cả lần đó = totalReceivedQuantity
      else if (purcharsOrder.status === 'PARTIALLY_RECEIVED') {
        const orderQty = Number(purcharsOrderItem.orderQuantity);
        // số lần nhập bổ sung
        const times = fakerVI.number.int({ min: 2, max: 4 });
        let remaining = orderQty;

        for (let i = 0; i < times; i++) {
          let qty;
          if (i === times - 1) {
            // Lần cuối lấy hết phần còn lại
            qty = remaining;
          } else {
            qty = fakerVI.number.int({
              min: 1,
              max: remaining - (times - i - 1),
            });
          }
          remaining -= qty;

          const receivedById = fakerVI.helpers.arrayElement(users).id;
          await prisma.purchaseOrderItemReceipt.create({
            data: {
              purcharsOrderItemId: purcharsOrderItem.id,
              receivedQuantity: qty,
              receivedById,
              note: `Nhập bổ sung lần thứ ${i + 1}`,
            },
          });
        }
      }

      // Cập nhật lại tổng số lượng nhận và đơn giá đã nhận
      // Lấy lại tổng số lượng và chi phí đã nhận từ bảng receipt
      const agg_purchaseOrderItemReceipt =
        await prisma.purchaseOrderItemReceipt.aggregate({
          where: { purcharsOrderItemId: purcharsOrderItem.id },
          _sum: {
            receivedQuantity: true,
          },
        });
      const totalReceivedQuantity = Number(
        agg_purchaseOrderItemReceipt._sum.receivedQuantity ?? 0,
      );
      const totalCostNotTax =
        totalReceivedQuantity * Number(purcharsOrderItem.unitCost);
      const totalCostWithTax =
        totalReceivedQuantity * Number(purcharsOrderItem.unitCostWithTax);
      // Cập nhật lại PurcharsOrderItem
      await prisma.purcharsOrderItem.update({
        where: { id: purcharsOrderItem.id },
        data: {
          totalReceivedQuantity,
          totalCostNotTax,
          totalCostWithTax,
        },
      });

      // Cập nhật lại tổng bill theo đơn nhập hàng
      const agg_PurcharOrderItem = await prisma.purcharsOrderItem.aggregate({
        where: {
          purcharsOrderId: purcharsOrder.id,
        },
        _sum: {
          totalCostNotTax: true,
          totalCostWithTax: true,
        },
      });

      await prisma.purcharsOrder.update({
        where: {
          id: purcharsOrder.id,
        },
        data: {
          totalNotTax: agg_PurcharOrderItem._sum.totalCostNotTax ?? 0,
          totalWithTax: agg_PurcharOrderItem._sum.totalCostWithTax ?? 0,
        },
      });
    }
  }
}
