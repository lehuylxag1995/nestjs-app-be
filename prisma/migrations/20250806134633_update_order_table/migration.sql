-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" DROP CONSTRAINT "OrderItems_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Orders" DROP CONSTRAINT "Orders_userId_fkey";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Orders" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ShopQuanAoTheThao"."Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
