import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//Tạo quy tắc định giá
export async function createPricingRule(percent: number) {
  //Tạo mặc định tất cả sản phẩm 20% lợi nhuận
  await prisma.pricingRule.create({
    data: {
      categoryId: null,
      customerId: null,
      productVariantId: null,
      margin: percent,
    },
  });
}
