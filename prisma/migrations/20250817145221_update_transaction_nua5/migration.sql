-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" DROP CONSTRAINT "InventoryTransactions_purcharsOrderItemRecieptId_fkey";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ALTER COLUMN "purcharsOrderItemRecieptId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_purcharsOrderItemRecieptId_fkey" FOREIGN KEY ("purcharsOrderItemRecieptId") REFERENCES "ShopQuanAoTheThao"."PurchaseOrderItemReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
