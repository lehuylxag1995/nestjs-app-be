/*
  Warnings:

  - A unique constraint covering the columns `[purcharsOrderItemRecieptId]` on the table `InventoryTransactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `purcharsOrderItemRecieptId` to the `InventoryTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD COLUMN     "purcharsOrderItemRecieptId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTransactions_purcharsOrderItemRecieptId_key" ON "ShopQuanAoTheThao"."InventoryTransactions"("purcharsOrderItemRecieptId");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_purcharsOrderItemRecieptId_fkey" FOREIGN KEY ("purcharsOrderItemRecieptId") REFERENCES "ShopQuanAoTheThao"."PurchaseOrderItemReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
