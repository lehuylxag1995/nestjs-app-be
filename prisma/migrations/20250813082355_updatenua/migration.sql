/*
  Warnings:

  - You are about to drop the column `total` on the `InventoryTransactions` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `PurcharsOrders` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `PurchaseOrderItems` table. All the data in the column will be lost.
  - Made the column `expectedDeliveryDate` on table `PurcharsOrders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" DROP COLUMN "total",
ADD COLUMN     "costPriceWithTax" DECIMAL(13,3) DEFAULT 0,
ADD COLUMN     "taxAmount" DECIMAL(13,3) DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(5,3) DEFAULT 0,
ADD COLUMN     "totalCostNotTax" DECIMAL(13,3) DEFAULT 0,
ADD COLUMN     "totalCostWithTax" DECIMAL(13,3) DEFAULT 0,
ALTER COLUMN "costPrice" DROP NOT NULL,
ALTER COLUMN "listedPrice" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."PurcharsOrders" DROP COLUMN "total",
ADD COLUMN     "totalNotTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
ADD COLUMN     "totalWithTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
ALTER COLUMN "expectedDeliveryDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."PurchaseOrderItems" DROP COLUMN "totalCost",
ADD COLUMN     "taxAmount" DECIMAL(13,3) NOT NULL DEFAULT 0,
ADD COLUMN     "totalCostNotTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
ADD COLUMN     "totalCostWithTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
ADD COLUMN     "unitCostWithTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
ALTER COLUMN "unitCost" SET DEFAULT 0,
ALTER COLUMN "taxRate" SET DEFAULT 0;
