import { PrismaClient } from '@prisma/client';
import { createCategories } from './seeds/categories.seed';
import { createInventoryByProductAndVariants } from './seeds/inventories.seed';
import { createInventoryTransactions } from './seeds/inventory_transactions.seed';
import { createPricingRule } from './seeds/pricing_rule.seed';
import { createProductImageForProducts } from './seeds/product_images.seed';
import { createProductVariantForProducts } from './seeds/product_vartiants.seed';
import { createProductForLeafCategories } from './seeds/products.seed';
import { createPurcharsOrderBySupplier } from './seeds/purchars_order.seed';
import { createPurscharOrderItemReceipt } from './seeds/purchars_order_item_receipt.seed';
import { createPurcharsOrderItemsByPurcharsOrder } from './seeds/purchars_order_items.seed';
import { createSupplier } from './seeds/suppliers.seed';
import { createUsers } from './seeds/users.seed';

const prisma = new PrismaClient();

async function main() {
  //Luồng thông tin cơ bản
  await createUsers(50, 5, 2);
  console.log('✅ Seed User');
  await createSupplier(20);
  console.log('✅ Seed Supplier');
  await createCategories(3, 3); //cây tối đa 3 tầng, mỗi node có tối đa 3 con
  console.log('✅ Seed Categories');
  await createProductForLeafCategories(3, 10);
  console.log('✅ Seed Products');
  await createProductVariantForProducts(1, 4);
  console.log('✅ Seed Products Variants');
  await createProductImageForProducts(3, 5);
  console.log('✅ Seed Products Image');
  await createPricingRule(20);
  console.log('✅ Seed Pricing Rule');
  await createInventoryByProductAndVariants();
  console.log('✅ Seed Inventory');

  //Luồng nhập hàng
  await createPurcharsOrderBySupplier(5, 10, 20, 2);
  console.log('✅ Seed Purchars Order');
  await createPurcharsOrderItemsByPurcharsOrder(1, 5);
  console.log('✅ Seed Purchars Order Item');
  await createPurscharOrderItemReceipt();
  console.log('✅ Seed Purchars Order Item Receipt');

  //Luồng quản lý kho -> để tạo giá niêm yết
  await createInventoryTransactions();
  console.log('✅ Seed Inventory Transaction (Import) ');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed lỗi:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
