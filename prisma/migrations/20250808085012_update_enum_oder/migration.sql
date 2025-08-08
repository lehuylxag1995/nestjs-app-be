/*
  Warnings:

  - The values [PAID] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ShopQuanAoTheThao"."OrderStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');
ALTER TABLE "ShopQuanAoTheThao"."Orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ShopQuanAoTheThao"."Orders" ALTER COLUMN "status" TYPE "ShopQuanAoTheThao"."OrderStatus_new" USING ("status"::text::"ShopQuanAoTheThao"."OrderStatus_new");
ALTER TYPE "ShopQuanAoTheThao"."OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "ShopQuanAoTheThao"."OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "ShopQuanAoTheThao"."OrderStatus_old";
ALTER TABLE "ShopQuanAoTheThao"."Orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
