/*
  Warnings:

  - You are about to drop the column `receivedById` on the `PurcharsOrders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurcharsOrders" DROP CONSTRAINT "PurcharsOrders_receivedById_fkey";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."PurcharsOrders" DROP COLUMN "receivedById";
