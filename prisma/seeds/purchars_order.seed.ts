import { fakerVI } from '@faker-js/faker';
import { PrismaClient, PurcharsOrderStatus } from '@prisma/client';
const prisma = new PrismaClient();

//Tạo đơn nhập hàng
export async function createPurcharsOrderBySupplier(
  numberDRAFT: number,
  numberPARTIALLY_RECEIVED: number,
  numberRECEIVED: number,
  numberCANCELED,
) {
  //Nhà cung cấp
  const listSupplierId = await prisma.supplier.findMany({
    select: { id: true },
  });

  // Nhân viên tạo
  const listUserId = await prisma.user.findMany({
    select: { id: true },
    where: { role: 'STAFF' },
  });

  async function createOrders(
    status: PurcharsOrderStatus,
    count: number,
    isRecieved?: boolean,
  ) {
    for (let i = 0; i < count; i++) {
      const randomSupplierId = fakerVI.helpers.arrayElement(listSupplierId).id;
      const ramdomUserId = fakerVI.helpers.arrayElement(listUserId).id;
      const orderDate = fakerVI.date.recent({ days: 20 });
      const dateWithin30Days = fakerVI.date.soon({ days: 60 }).toISOString();

      await prisma.purcharsOrder.create({
        data: {
          supplierId: randomSupplierId,
          createdById: ramdomUserId,
          orderDate: orderDate,
          expectedDeliveryDate: dateWithin30Days,
          receivedById: isRecieved
            ? fakerVI.helpers.arrayElement(listUserId).id
            : null,
          status,
          totalNotTax: 0,
          totalWithTax: 0,
          note: 'Hệ thống tạo demo',
        },
      });
    }
  }

  // Tạo theo từng trạng thái
  await createOrders(PurcharsOrderStatus.DRAFT, numberDRAFT);
  await createOrders(
    PurcharsOrderStatus.PARTIALLY_RECEIVED,
    numberPARTIALLY_RECEIVED,
    true,
  );
  await createOrders(PurcharsOrderStatus.RECEIVED, numberRECEIVED, true);
  await createOrders(PurcharsOrderStatus.CANCELED, numberCANCELED);
}
